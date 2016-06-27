Polymer({

  is: 'paper-datatable-api',

  properties: {
    /**
     * The columns element.
     * It is exposed to create a list of label (see demo/advance-demo.html).
     */
    columns: {
      type: Array,
      notify: true,
      value: [],
    },
    /**
     * Contains the data which will be displayed in the table.
     */
    data: {
      type: Array,
      observer: '_dataChanged',
    },
    /**
     * If true, the pagination will be activated.
     */
    paginate: {
      type: Boolean,
      value: false,
    },
    /**
     * The current page.
     */
    page: {
      type: Number,
      notify: true,
    },
    /**
     * The current size.
     */
    size: {
      type: Number,
      notify: true,
    },
    /**
     * If true, the header will be static and the height of body will be
     * setted through the dedicated mixin (--paper-datatable-api-tbody-height).
     */
    frozenHeader: {
      type: Boolean,
      value: false,
    },
    /**
     * The total of elements have to be provided in case of pagination, it is mandatory.
     */
    totalElements: Number,
    /**
     * The total of pages have to be provided in case of pagination, it is mandatory.
     * It is used to compute the footer.
     */
    totalPages: Number,
    /**
     * The available size in case of pagination.
     */
    availableSize: {
      type: Array,
      value: [10],
    },
    selectable: {
      type: Boolean,
      value: false,
    },
    selectedRows: {
      type: Array,
      value: [],
    },
  },

  behaviors: [
    Polymer.IronResizableBehavior
  ],

  listeners: {
    'iron-resize': '_resizeHeader'
  },

  attached: function() {
    this._setColumns();
  },

  _isFrozen: function(frozenHeader) {
    return frozenHeader ? 'frozen' : '';
  },

  _nextPage: function() {
    if ((this.page + 1) < this.totalPages) {
      this.page = this.page + 1;
    }
  },

  _prevPage: function() {
    if (this.page > 0) {
      this.page = this.page - 1;
    }
  },

  _nextButtonEnabled: function(page, totalPages) {
    return (page + 1) < totalPages;
  },

  _prevButtonEnabled: function(page) {
    return page > 0;
  },

  _computeCurrentSize: function(page, size) {
    return (page * size) + 1;
  },

  _computeCurrentMaxSize: function(page, size) {
    return size * (page + 1);
  },

  _dataChanged: function(data) {
    this._removeRows();
    this._fillRows(data);
    this._fillColumns();
    this._resizeHeader();
  },

  _removeRows: function() {
    var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
    pgTrs.forEach(function(pgTr) {
      Polymer.dom(this.$$('tbody')).removeChild(pgTr);
    }, this);
  },

  _fillRows: function(data) {
    data.forEach(function(rowData) {
      var trLocal = document.createElement('tr');
      trLocal.rowData = rowData;
      trLocal.className = 'paper-datatable-api-tr';
      if (this.frozenHeader) {
        trLocal.className = trLocal.className + ' frozen';
      }
      Polymer.dom(this.$$('tbody')).appendChild(trLocal);
    }, this);
  },

  _fillColumns: function() {
    var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

    pgTrs.forEach(function(pgTr, i) {

      var rowData = pgTr.rowData;

      if (this.selectable) {
        var tdSelectable = document.createElement('td');
        tdSelectable.className = 'selectable';
        var paperCheckbox = document.createElement('paper-checkbox');
        this.listen(paperCheckbox, 'change', '_selectChange');
        paperCheckbox.rowData = rowData;
        paperCheckbox.rowIndex = i;
        Polymer.dom(tdSelectable).appendChild(paperCheckbox);
        Polymer.dom(pgTr).appendChild(tdSelectable);
        Polymer.dom.flush()
      }

      this.columns.forEach(function(paperDatatableApiColumn) {

        var valueFromRowData = this._extractData(rowData, paperDatatableApiColumn.property);

        var otherPropertiesValue = {};
        paperDatatableApiColumn.otherProperties.forEach(function(property) {
          otherPropertiesValue[property] = this._extractData(rowData, property);
        }, this);

        var tdLocal = document.createElement('td');
        var template = paperDatatableApiColumn.fillTemplate(valueFromRowData, otherPropertiesValue);
        Polymer.dom(tdLocal).appendChild(template.root);
        Polymer.dom(pgTr).appendChild(tdLocal);

      }, this);
    }, this);
  },

  _selectChange: function(event) {
    var rowData = event.currentTarget.rowData;
    var rowId = event.currentTarget.rowIndex;
    var eventData = {};
    if (event.target.checked){
      this.push('selectedRows', rowId);
      eventData = {
        selected: [rowId],
        data: rowData,
      };
    } else {
      this.splice('selectedRows', this.selectedRows.indexOf(rowId), 1);
      eventData = {
        deselected: [rowId],
      };
    }
    /**
     * Fired when a row is selected.
     * @event selection-changed
     * Event param: {{node: Object}} detail Contains selected id and row data.
     */
    this.fire('selection-changed', eventData);
  },

  _resizeHeader: function() {
    if (this.frozenHeader) {
      this.async(function() {
        var pgTds = Polymer.dom(this.root).querySelectorAll('tbody tr:first-child td');
        pgTds.forEach(function(pgTd, i) {
          if (this.selectable && i === 0) {
            return;
          }

          i++;
          var pgTh = Polymer.dom(this.root).querySelector('thead th:nth-of-type(' + i + ')');

          if (pgTh) {
            pgTd.style.width = 'auto';
            pgTh.style.width = 'auto';
            this.async(function() {
              var thOffsetWidth = pgTh.offsetWidth - 52;
              if (pgTd.offsetWidth < (thOffsetWidth + 52)) {
                pgTd.style.width = thOffsetWidth + 'px';
              }

              this.async(function() {
                var tdOffsetWidth = pgTd.offsetWidth - 52;

                if (thOffsetWidth < tdOffsetWidth) {
                  pgTh.style.width = tdOffsetWidth + 'px';
                }
              });
            });
          }
        }, this);
      });
    }
  },

  _extractData: function(rowData, columnProperty) {
    if (columnProperty) {
      var splittedProperties = columnProperty.split('.');
      if (splittedProperties.length > 1) {
        return splittedProperties.reduce(function(prevRow, property) {
          if (typeof prevRow === 'string') {
            return rowData[prevRow][property];
          } else {
            return prevRow[property];
          }
        });
      } else {
        return rowData[columnProperty];
      }
    } else {
      return null;
    }
  },

  _setColumns: function() {
    this.columns = this.queryAllEffectiveChildren('paper-datatable-api-column');
    this._columnsHeight = this.columns.length;
  },

  /**
   * Hide or show a column following the number in argument.
   *
   * @property toggleColumn
   * @param {Number} columnPosition The number of column which will be toggled.
   */
  toggleColumn: function(columnPosition) {
    var isShow = this.columns[columnPosition].show;
    var indexColumn = this.selectable ? columnPosition + 2 : columnPosition + 1;
    var cssQuery = 'tr th:nth-of-type(' + indexColumn + '), tr td:nth-of-type(' + indexColumn + ')';
    Polymer.dom(this.root).querySelectorAll(cssQuery).forEach(function(pgTdsThs) {
      var displayMode = isShow ? 'none' : 'table-cell';
      pgTdsThs.style.display = displayMode;
    }, this);
    this.set('columns.' + columnPosition + '.show', isShow ? false : true);
    this._resizeHeader();
  },

  _newSizeIsSelected: function() {
    var newSize = this.$$('paper-listbox').selected;
    if (newSize) {
      this.page = 0;
      this.size = newSize;
    }
  },

  _handleSort: function(event) {
    var column = event.model.column;
    var th = event.currentTarget;
    if (column.sortable) {
      var sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
      th.setAttribute('sort-direction', sortDirection);
      th.setAttribute('sorted', true);
      column.set('sortDirection', sortDirection);
      column.set('sorted', true);
      this.fire('sort', {
        sort: {
          property: column.property,
          direction: column.sortDirection
        },
        column: column
      });
    }
  },
});
