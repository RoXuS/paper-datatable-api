'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DtPaperDatatableApi = function () {
  function DtPaperDatatableApi() {
    _classCallCheck(this, DtPaperDatatableApi);
  }

  _createClass(DtPaperDatatableApi, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'paper-datatable-api';
      this.properties = {
        /**
         * The columns element.
         */
        _columns: {
          type: Array,
          value: []
        },
        /**
         * The list of hideable columns.
         * It is exposed to create a list of label (see demo/advance-demo.html).
         */
        toggleColumns: {
          type: Array,
          notify: true,
          value: []
        },
        /**
         * Contains the data which will be displayed in the table.
         */
        data: {
          type: Array,
          observer: '_dataChanged'
        },
        /**
         * If true, the pagination will be activated.
         */
        paginate: {
          type: Boolean,
          value: false
        },
        /**
         * The current page.
         */
        page: {
          type: Number,
          notify: true
        },
        /**
         * The current size.
         */
        size: {
          type: Number,
          notify: true
        },
        /**
         * If true, a filter on each column is added.
         */
        filters: {
          type: Boolean,
          value: false
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
          value: [10]
        },
        /**
         * If true, the rows may be selectable.
         */
        selectable: {
          type: Boolean,
          value: false
        },
        /**
         * If false, the paper-checkbox in the header which allow to select all rows is hidden.
         */
        allowTheSelectionOfAllTheElements: {
          type: Boolean,
          value: true
        },
        /**
         * Contains the positions of selected columns.
         * Can contain a specific data if selectableDataKey is setted.
         */
        selectedRows: {
          type: Array,
          value: []
        },
        /**
         * If it is setted, the selected rows are persistant (throught the pages).
         * Uses the value of the rowData following the defined key.
         */
        selectableDataKey: {
          type: String
        },
        /**
         * Change the position of the sort icon in the header.
         */
        positionSortIcon: {
          type: String,
          value: 'left'
        },
        language: {
          type: String,
          value: 'en'
        },
        /**
         * If it is setted, the date picker is localized with this object.
         * See https://vaadin.com/docs/-/part/elements/vaadin-date-picker/vaadin-date-picker-localization.html.
         */
        localeDatePicker: {
          type: Object
        },
        resources: {
          value: function value() {
            return {
              en: {
                rowPerPage: 'Row per page',
                of: 'of'
              },
              'en-en': {
                rowPerPage: 'Row per page',
                of: 'of'
              },
              'en-US': {
                rowPerPage: 'Row per page',
                of: 'of'
              },
              fr: {
                rowPerPage: 'Ligne par page ',
                of: 'sur'
              },
              'fr-fr': {
                rowPerPage: 'Ligne par page ',
                of: 'sur'
              }
            };
          }
        },
        timeoutFilter: Number
      };
    }
  }, {
    key: 'attached',
    value: function attached() {
      this._setColumns();
      var userLang = navigator.language || navigator.userLanguage;
      this.language = userLang;
    }
  }, {
    key: 'equals',
    value: function equals(targetedValue, value) {
      return value === targetedValue;
    }
  }, {
    key: '_generateClass',
    value: function _generateClass(filters, paginate) {
      if (filters && paginate) {
        return 'paginate filters';
      } else if (filters) {
        return 'filters';
      }

      return 'paginate';
    }
  }, {
    key: '_nextPage',
    value: function _nextPage() {
      if (this.page + 1 < this.totalPages) {
        this.page = this.page + 1;
      }
    }
  }, {
    key: '_prevPage',
    value: function _prevPage() {
      if (this.page > 0) {
        this.page = this.page - 1;
      }
    }
  }, {
    key: '_nextButtonEnabled',
    value: function _nextButtonEnabled(page, totalPages) {
      return page + 1 < totalPages;
    }
  }, {
    key: '_prevButtonEnabled',
    value: function _prevButtonEnabled(page) {
      return page > 0;
    }
  }, {
    key: '_computeCurrentSize',
    value: function _computeCurrentSize(page, size) {
      return page * size + 1;
    }
  }, {
    key: '_computeCurrentMaxSize',
    value: function _computeCurrentMaxSize(page, size) {
      var maxSize = size * (page + 1);
      return maxSize > this.totalElements ? this.totalElements : maxSize;
    }
  }, {
    key: '_dataChanged',
    value: function _dataChanged(data) {
      this._removeRows();
      this._fillRows(data);
      this._fillColumns();
    }
  }, {
    key: '_removeRows',
    value: function _removeRows() {
      var _this = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
      pgTrs.forEach(function (pgTr) {
        return Polymer.dom(_this.$$('tbody')).removeChild(pgTr);
      });
    }
  }, {
    key: '_fillRows',
    value: function _fillRows(data) {
      var _this2 = this;

      data.forEach(function (rowData) {
        var trLocal = document.createElement('tr');
        trLocal.rowData = rowData;
        trLocal.className = 'paper-datatable-api-tr';

        Polymer.dom(_this2.$$('tbody')).appendChild(trLocal);
      });
    }
  }, {
    key: '_fillColumns',
    value: function _fillColumns() {
      var _this3 = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

      pgTrs.forEach(function (pgTr, i) {
        var rowData = pgTr.rowData;

        if (_this3.selectable) {
          var tdSelectable = document.createElement('td');
          tdSelectable.className = 'selectable';
          var paperCheckbox = document.createElement('paper-checkbox');
          _this3.listen(paperCheckbox, 'change', '_selectChange');
          paperCheckbox.rowData = rowData;
          paperCheckbox.rowIndex = i;

          if (_this3.selectableDataKey !== undefined && rowData[_this3.selectableDataKey] !== undefined && _this3.selectedRows.indexOf(rowData[_this3.selectableDataKey]) !== -1) {
            paperCheckbox.checked = true;
          }

          Polymer.dom(tdSelectable).appendChild(paperCheckbox);
          Polymer.dom(pgTr).appendChild(tdSelectable);
          Polymer.dom.flush();
        }

        _this3._columns.forEach(function (paperDatatableApiColumn) {
          var valueFromRowData = _this3._extractData(rowData, paperDatatableApiColumn.property);

          var otherPropertiesValue = {};
          paperDatatableApiColumn.otherProperties.forEach(function (property) {
            otherPropertiesValue[property] = _this3._extractData(rowData, property);
          });

          var tdLocal = document.createElement('td');
          var template = paperDatatableApiColumn.fillTemplate(valueFromRowData, otherPropertiesValue);

          if (paperDatatableApiColumn.hideable && paperDatatableApiColumn.hidden) {
            tdLocal.style.display = 'none';
          }

          Polymer.dom(tdLocal).appendChild(template.root);
          Polymer.dom(pgTr).appendChild(tdLocal);
        });
      });
    }
  }, {
    key: '_selectAllCheckbox',
    value: function _selectAllCheckbox(event) {
      var _this4 = this;

      var localTarget = Polymer.dom(event).localTarget;
      var allPaperCheckbox = Polymer.dom(this.root).querySelectorAll('tbody tr td paper-checkbox');
      allPaperCheckbox.forEach(function (paperCheckboxParams) {
        var paperCheckbox = paperCheckboxParams;
        if (localTarget.checked) {
          paperCheckbox.checked = true;
        } else {
          paperCheckbox.checked = false;
        }

        _this4._selectChange(paperCheckbox);
      });
    }
  }, {
    key: '_selectChange',
    value: function _selectChange(event) {
      var localTarget = void 0;
      if (event.type && event.type === 'change') {
        localTarget = Polymer.dom(event).localTarget;
      } else {
        localTarget = event;
      }

      var tr = Polymer.dom(localTarget).parentNode.parentNode;

      var rowData = localTarget.rowData;

      var rowId = localTarget.rowIndex;
      if (this.selectableDataKey !== undefined && rowData[this.selectableDataKey] !== undefined) {
        rowId = rowData[this.selectableDataKey];
      }

      var eventData = {};
      if (localTarget.checked) {
        this.push('selectedRows', rowId);
        eventData = {
          selected: [rowId],
          data: rowData
        };
        tr.classList.add('selected');
      } else {
        this.splice('selectedRows', this.selectedRows.indexOf(rowId), 1);
        eventData = {
          deselected: [rowId],
          data: rowData
        };
        tr.classList.remove('selected');
      }
      /**
       * Fired when a row is selected.
       * @event selection-changed
       * Event param: {{node: Object}} detail Contains selected id and row data.
       */
      this.fire('selection-changed', eventData);
    }
  }, {
    key: '_extractData',
    value: function _extractData(rowData, columnProperty) {
      if (columnProperty) {
        var splittedProperties = columnProperty.split('.');
        if (splittedProperties.length > 1) {
          return splittedProperties.reduce(function (prevRow, property) {
            if (typeof prevRow === 'string') {
              return rowData[prevRow][property];
            }

            return prevRow[property];
          });
        }
        return rowData[columnProperty];
      }
      return null;
    }
  }, {
    key: '_setColumns',
    value: function _setColumns() {
      this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column').map(function (columnParams, i) {
        var column = columnParams;
        column.position = i;
        return column;
      });

      this.toggleColumns = this._columns.filter(function (column) {
        return column.hideable;
      });

      this._columnsHeight = this.selectable ? this._columns.length + 1 : this._columns.length;
    }

    /**
     * Hide or show a column following the number in argument.
     *
     * @property toggleColumn
     * @param {Number} columnPosition The number of column which will be toggled.
     */

  }, {
    key: 'toggleColumn',
    value: function toggleColumn(columnPosition) {
      var _this5 = this;

      var column = this._columns[columnPosition];
      if (column && column.hideable) {
        (function () {
          var isHidden = column.hidden;
          var indexColumn = _this5.selectable ? columnPosition + 2 : columnPosition + 1;
          var cssQuery = 'tr th:nth-of-type(' + indexColumn + '), tr td:nth-of-type(' + indexColumn + ')';
          Polymer.dom(_this5.root).querySelectorAll(cssQuery).forEach(function (tdThParams) {
            var tdTh = tdThParams;
            tdTh.style.display = isHidden ? 'table-cell' : 'none';
          });

          column.hidden = !isHidden;
          var toggleColumnIndex = _this5.toggleColumns.findIndex(function (toggleColumn) {
            return toggleColumn.position === columnPosition;
          });

          _this5.set('toggleColumns.' + toggleColumnIndex + '.hidden', !isHidden);
        })();
      }
    }
  }, {
    key: '_getThDisplayStyle',
    value: function _getThDisplayStyle(hidden) {
      if (hidden) {
        return 'none';
      }

      return 'table-cell';
    }
  }, {
    key: '_newSizeIsSelected',
    value: function _newSizeIsSelected() {
      var newSize = this.$$('paper-listbox').selected;
      if (newSize) {
        this.page = 0;
        this.size = newSize;
      }
    }
  }, {
    key: '_handleSort',
    value: function _handleSort(event) {
      var column = event.model.column;
      var paperIconButton = event.currentTarget;
      var th = paperIconButton.parentNode.parentNode;

      var queryPaperIconButton = 'thead th[sortable][sorted] paper-icon-button.sort';
      Polymer.dom(this.root).querySelectorAll(queryPaperIconButton).forEach(function (otherPaperIconButton) {
        var thSorted = otherPaperIconButton.parentNode.parentNode;

        if (thSorted.dataColumn !== column) {
          thSorted.removeAttribute('sort-direction');
          thSorted.removeAttribute('sorted');
          thSorted.dataColumn.set('sortDirection', undefined);
          thSorted.dataColumn.set('sorted', true);
        }
      });

      if (column.sortable) {
        var sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
        th.setAttribute('sort-direction', sortDirection);
        th.setAttribute('sorted', true);
        column.set('sortDirection', sortDirection);
        column.set('sorted', true);

        /**
         * Fired when a column is sorted.
         * @event sort
         * Event param: {{node: Object}} detail Contains sort object.
         * { sort: { property: STRING, direction: asc|desc }, column: OBJECT }
         */
        this.fire('sort', {
          sort: {
            property: column.property,
            direction: column.sortDirection
          },
          column: column
        });
      }
    }
  }, {
    key: '_handleActiveFilterChange',
    value: function _handleActiveFilterChange(event) {
      var _this6 = this;

      var parentDiv = event.currentTarget.parentNode;
      this.async(function () {
        var paperInput = parentDiv.querySelector(':scope > paper-input');
        if (paperInput) {
          paperInput.focus();
        } else {
          var datePicker = parentDiv.querySelector('vaadin-date-picker-light');
          if (datePicker) {
            paperInput = datePicker.querySelector('paper-input');
            datePicker.i18n = _this6.localeDatePicker;
          }
        }
      });
    }
  }, {
    key: '_handlePaperInputChange',
    value: function _handlePaperInputChange(event) {
      var _this7 = this;

      var column = event.model.column;
      var input = event.currentTarget;

      this.async(function () {
        if (input.value !== '') {
          _this7._launchFilterEvent(input, column);
        } else if (!input.focused) {
          _this7._toggleFilter(column);
        }
      });
    }
  }, {
    key: '_handleTapClear',
    value: function _handleTapClear(event) {
      var input = event.currentTarget.parentNode.parentNode.parentNode;
      input.value = '';
    }
  }, {
    key: '_handleVaadinDatePickerLight',
    value: function _handleVaadinDatePickerLight(event) {
      var _this8 = this;

      var column = event.model.column;
      var input = event.currentTarget;

      this.async(function () {
        if (input.value !== '') {
          _this8._launchFilterEvent(input, column);
        }
      });
    }
  }, {
    key: '_toggleFilter',
    value: function _toggleFilter(column) {
      var columnIndex = this._columns.findIndex(function (_column) {
        return _column.property === column.property;
      });

      if (column.activeFilter) {
        this.set('_columns.' + columnIndex + '.activeFilter', false);
      } else {
        this.set('_columns.' + columnIndex + '.activeFilter', true);
      }
    }
  }, {
    key: '_launchFilterEvent',
    value: function _launchFilterEvent(input, column) {
      /**
       * Fired when a filters inputs changed.
       * @event filter
       * Event param: {{node: Object}} detail Contains sort object.
       * { filter: { property: STRING, value: STRING }, column: OBJECT }
       */
      this.fire('filter', {
        filter: {
          property: column.property,
          value: input.value
        },
        column: column
      });
    }
  }, {
    key: '_handleFilter',
    value: function _handleFilter(event) {
      var paperIconButton = event.currentTarget;
      var column = event.model.column;

      if (column.activeFilter) {
        var input = paperIconButton.parentNode.querySelector('paper-input');
        input.value = '';
        this._launchFilterEvent(input, column);
      }
      this._toggleFilter(column);
    }
  }, {
    key: '_handleKeyDownInput',
    value: function _handleKeyDownInput(event) {
      var _this9 = this;

      var column = event.model.column;
      var input = event.currentTarget;
      if (input.previousValue !== input.value) {
        if (event.keyCode === 13) {
          this._launchFilterEvent(input, column);
          input.previousValue = input.value;
        } else {
          clearTimeout(this.timeoutFilter);
          this.timeoutFilter = setTimeout(function () {
            if (input.previousValue !== input.value) {
              _this9._launchFilterEvent(input, column);
            }
            input.previousValue = input.value;
          }, 1000);
        }
      }
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior];
    }
  }]);

  return DtPaperDatatableApi;
}();

Polymer(DtPaperDatatableApi);