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
          value: function value() {
            return [];
          }
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
          notify: true,
          observer: '_pageChanged'
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
          value: function value() {
            return [];
          },
          notify: true
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
        frozenHeader: {
          type: Boolean,
          value: false
        },
        resources: {
          value: function value() {
            return {
              en: {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-en': {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-US': {
                rowPerPage: 'Rows per page',
                of: 'of'
              },
              'en-us': {
                rowPerPage: 'Rows per page',
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
        /**
         * Change the position of the footer.
         */
        footerPosition: {
          type: String,
          value: 'right'
        },
        /**
         * Checkbox column position.
         */
        checkboxColumnPosition: {
          type: Number,
          value: 0
        },
        _dragEnd: {
          type: Boolean,
          value: true
        },
        /**
         * Order of the columns
         */
        propertiesOrder: {
          type: Array,
          value: [],
          notify: true
        }
      };

      this.listeners = {
        'iron-resize': '_resizeHeader'
      };
    }
  }, {
    key: '_resizeHeader',


    /** Frozen Mode **/

    value: function _resizeHeader() {
      var _this = this;

      this.async(function () {
        if (_this.frozenHeader) {
          var bodyWidth = _this._getTbodyWidths();
          var headerWidth = _this._getTheadWidths();

          if (headerWidth && bodyWidth) {
            /**
             * Set all width to auto.
             */
            _this._resizeAllWidthToAuto(bodyWidth);
            /**
             * Resize header width following body width.
             */
            _this._resizeWidth(bodyWidth, headerWidth, 'header');
            bodyWidth = _this._getTbodyWidths();
            headerWidth = _this._getTheadWidths();
            /**
             * Resize body width following header width.
             */
            _this._resizeWidth(headerWidth, bodyWidth, 'body');
            bodyWidth = _this._getTbodyWidths();
            headerWidth = _this._getTheadWidths();
            /**
             * Reajust header width with the new width of body.
             */
            _this._resizeWidth(bodyWidth, headerWidth, 'header', true);
          }
          _this.fire('end-of-resize', {});
        }
      }, 10);
    }
  }, {
    key: '_resizeAllWidthToAuto',
    value: function _resizeAllWidthToAuto(bodyWidth) {
      var _this2 = this;

      bodyWidth.forEach(function (bodyTrWidth, index) {
        _this2._resizeTd('auto', index, 'header');
        _this2._resizeTd('auto', index, 'body');
      });
    }
  }, {
    key: '_resizeWidth',
    value: function _resizeWidth(iterateArray, arrayWidth, type) {
      var _this3 = this;

      var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      iterateArray.forEach(function (width, index) {
        if (width > arrayWidth[index] || force) {
          _this3._resizeTd(width, index, type);
        }
      });
    }
  }, {
    key: '_getTheadWidths',
    value: function _getTheadWidths() {
      var frozenHeaderTable = this.$$('#frozenHeaderTable');
      if (frozenHeaderTable) {
        var allTheadTrTh = frozenHeaderTable.querySelectorAll('thead tr th');
        return Object.keys(allTheadTrTh).map(function (headerThIndex) {
          return allTheadTrTh[headerThIndex].offsetWidth;
        });
      }
      return null;
    }
  }, {
    key: '_getTbodyWidths',
    value: function _getTbodyWidths() {
      var table = this.$$('table:not(#frozenHeaderTable)');
      var tbody = table.querySelector('tbody tr');

      if (tbody) {
        var allTbodyTd = tbody.querySelectorAll('td');
        return Object.keys(allTbodyTd).map(function (bodyTdIndex) {
          return allTbodyTd[bodyTdIndex].offsetWidth;
        });
      }
      return null;
    }
  }, {
    key: '_resizeTd',
    value: function _resizeTd(size, columnIndex, type) {
      var allTheadTrTh = this.$$('tbody tr').querySelectorAll('td');
      if (type === 'header') {
        allTheadTrTh = this.$$('#frozenHeaderTable thead tr').querySelectorAll('th');
      }

      if (allTheadTrTh.length > 0) {
        var paddingLeftPx = window.getComputedStyle(allTheadTrTh[columnIndex]).paddingLeft;
        var paddingLeft = paddingLeftPx.split('px')[0];
        var paddingRightPx = window.getComputedStyle(allTheadTrTh[columnIndex]).paddingRight;
        var paddingRight = paddingRightPx.split('px')[0];
        var horizontalPadding = parseInt(paddingRight, 10) + parseInt(paddingLeft, 10);

        if (size !== 'auto' && size - horizontalPadding !== 0) {
          var sizeWithoutPad = size - horizontalPadding;
          Polymer.dom(allTheadTrTh[columnIndex]).firstElementChild.style.width = sizeWithoutPad + 'px';
        } else if (size === 'auto') {
          Polymer.dom(allTheadTrTh[columnIndex]).firstElementChild.style.width = 'auto';
        }
      }
    }
  }, {
    key: '_handleWrapperScroll',
    value: function _handleWrapperScroll(event) {
      if (this.frozenHeader) {
        this.$$('#headerWrapper').scrollLeft = event.target.scrollLeft;
      }
    }

    /** End of frozen mode **/

  }, {
    key: 'attached',
    value: function attached() {
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
    value: function _generateClass(frozenHeader, filters, paginate) {
      if (frozenHeader && filters && paginate) {
        return 'filters frozen paginate';
      }
      if (frozenHeader && filters) {
        return 'filters frozen';
      }
      if (frozenHeader && paginate) {
        return 'paginate frozen';
      }
      if (filters && paginate) {
        return 'paginate filters';
      }
      if (filters) {
        return 'filters';
      }
      if (paginate) {
        return 'paginate';
      }
      if (frozenHeader) {
        return 'frozen';
      }
      return '';
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
    value: function _computeCurrentMaxSize(page, size, totalElements) {
      var maxSize = size * (page + 1);
      return maxSize > totalElements ? totalElements : maxSize;
    }
  }, {
    key: '_init',
    value: function _init(data, propertiesOrder) {
      var _this4 = this;

      this._changeColumn(propertiesOrder, function () {
        _this4.async(function () {
          _this4._removeRows();
          _this4._fillRows(data);
          _this4._fillColumns();
          _this4._resizeHeader();
          _this4._footerPositionChange(_this4.footerPosition);
          _this4._handleDragAndDrop();
        });
      });
    }
  }, {
    key: '_dataChanged',
    value: function _dataChanged(data) {
      if (this._observer) {
        Polymer.dom(this).unobserveNodes(this._observer);
      }
      this._observer = Polymer.dom(this).observeNodes(this._setColumns.bind(this));
      this._init(data, this.propertiesOrder);
    }
  }, {
    key: '_pageChanged',
    value: function _pageChanged(page, oldPage) {
      this.oldPage = oldPage;
    }
  }, {
    key: '_removeRows',
    value: function _removeRows() {
      var _this5 = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
      pgTrs.forEach(function (pgTr) {
        return Polymer.dom(_this5.$$('tbody')).removeChild(pgTr);
      });
    }
  }, {
    key: '_fillRows',
    value: function _fillRows(data) {
      var _this6 = this;

      if (data) {
        data.forEach(function (rowData) {
          var trLocal = document.createElement('tr');
          trLocal.rowData = rowData;
          trLocal.className = 'paper-datatable-api-tr';

          _this6.listen(trLocal, 'mouseover', 'onOverTr');
          _this6.listen(trLocal, 'mouseout', 'onOutTr');

          Polymer.dom(_this6.$$('tbody')).appendChild(trLocal);
        });
      }
    }
  }, {
    key: 'onOverTd',
    value: function onOverTd(e) {
      this.fire('td-over', e.currentTarget);
    }
  }, {
    key: 'onOutTd',
    value: function onOutTd(e) {
      this.fire('td-out', e.currentTarget);
    }
  }, {
    key: 'onOverTr',
    value: function onOverTr(e) {
      this.fire('tr-over', e.currentTarget);
    }
  }, {
    key: 'onOutTr',
    value: function onOutTr(e) {
      this.fire('tr-out', e.currentTarget);
    }
  }, {
    key: '_findSelectableElement',
    value: function _findSelectableElement(rowData) {
      var splittedSelectableDataKey = this.selectableDataKey.split('.');
      var selectedRow = rowData;
      splittedSelectableDataKey.forEach(function (selectableDataKey) {
        selectedRow = selectedRow[selectableDataKey];
      });

      return selectedRow;
    }
  }, {
    key: '_fillColumns',
    value: function _fillColumns() {
      var _this7 = this;

      var pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

      pgTrs.forEach(function (pgTr, i) {
        var rowData = pgTr.rowData;

        _this7._columns.forEach(function (paperDatatableApiColumn, p) {
          if (_this7.selectable && p === _this7.checkboxColumnPosition) {
            var tdSelectable = document.createElement('td');
            tdSelectable.className = 'selectable';
            var paperCheckbox = document.createElement('paper-checkbox');
            _this7.listen(paperCheckbox, 'change', '_selectChange');
            paperCheckbox.rowData = rowData;
            paperCheckbox.rowIndex = i;

            if (_this7.selectableDataKey !== undefined) {
              var selectedRow = _this7._findSelectableElement(rowData);
              if (selectedRow !== undefined && _this7.selectedRows.indexOf(selectedRow) !== -1) {
                paperCheckbox.checked = true;
              }
            }

            Polymer.dom(tdSelectable).appendChild(paperCheckbox);
            Polymer.dom(pgTr).appendChild(tdSelectable);
            Polymer.dom.flush();
          }

          var valueFromRowData = _this7._extractData(rowData, paperDatatableApiColumn.property);

          var otherPropertiesValue = {};
          paperDatatableApiColumn.otherProperties.forEach(function (property) {
            otherPropertiesValue[property] = _this7._extractData(rowData, property);
          });

          var tdLocal = document.createElement('td');
          if (paperDatatableApiColumn.tdCustomStyle) {
            tdLocal.classList.add('customTd');
          }

          _this7.listen(tdLocal, 'mouseover', 'onOverTd');
          _this7.listen(tdLocal, 'mouseout', 'onOutTd');

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
      var _this8 = this;

      var localTarget = Polymer.dom(event).localTarget;
      var allPaperCheckbox = Polymer.dom(this.root).querySelectorAll('tbody tr td paper-checkbox');
      allPaperCheckbox.forEach(function (paperCheckboxParams) {
        var paperCheckbox = paperCheckboxParams;
        if (localTarget.checked) {
          if (!paperCheckbox.checked) {
            paperCheckbox.checked = true;
            _this8._selectChange(paperCheckbox);
          }
        } else if (paperCheckbox.checked) {
          paperCheckbox.checked = false;
          _this8._selectChange(paperCheckbox);
        }
      });
    }

    /**
     * Check the checkbox
     *
     * @property selectRow
     * @param {String} value The value of the row following the selectableDatakey.
     */

  }, {
    key: 'selectRow',
    value: function selectRow(value) {
      var _this9 = this;

      var table = this.$$('table:not(#frozenHeaderTable)');
      var allTr = table.querySelectorAll('tbody tr');
      allTr.forEach(function (tr) {
        var selectedRow = _this9._findSelectableElement(tr.rowData);

        if (selectedRow === value) {
          var checkbox = tr.querySelector('paper-checkbox');
          if (checkbox) {
            checkbox.checked = true;

            var rowId = checkbox.rowIndex;
            if (_this9.selectableDataKey !== undefined && selectedRow !== undefined) {
              rowId = selectedRow;
            }
            _this9.push('selectedRows', rowId);
            tr.classList.add('selected');
          }
        }
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

      if (this.selectableDataKey !== undefined) {
        var selectedRow = this._findSelectableElement(rowData);
        if (selectedRow) {
          rowId = selectedRow;
        }
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
      var generateTr = false;

      if (this._columns.length > 0) {
        generateTr = true;
      }

      this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column').map(function (columnParams, i) {
        var column = columnParams;
        column.position = i;
        return column;
      });

      if (this.propertiesOrder.length === 0) {
        this._generatePropertiesOrder();
      }

      this.toggleColumns = this._columns.filter(function (column) {
        return column.hideable || column.draggableColumn;
      });

      this._columnsHeight = this.selectable ? this._columns.length + 1 : this._columns.length;
      if (generateTr) {
        this._init(this.data);
      }
    }

    /**
     * Hide or show a column following the number in argument.
     *
     * @property toggleColumn
     * @param {Number} columnProperty The property of the column which will be toggled.
     */

  }, {
    key: 'toggleColumn',
    value: function toggleColumn(columnProperty) {
      var column = this._columns.find(function (columnElement) {
        return columnElement.property === columnProperty;
      });
      var index = this._columns.findIndex(function (columnElement) {
        return columnElement.property === columnProperty;
      });
      if (column && column.hideable) {
        var isHidden = column.hidden;
        var indexColumn = this.selectable ? index + 2 : index + 1;
        var cssQuery = 'thead tr th:nth-of-type(' + indexColumn + '), tbody tr td:nth-of-type(' + indexColumn + ')';
        Polymer.dom(this.root).querySelectorAll(cssQuery).forEach(function (tdThParams) {
          var tdTh = tdThParams;
          tdTh.style.display = isHidden ? 'table-cell' : 'none';
        });

        column.hidden = !isHidden;
        var toggleColumnIndex = this.toggleColumns.findIndex(function (toggleColumn) {
          return toggleColumn.property === columnProperty;
        });

        this.set('toggleColumns.' + toggleColumnIndex + '.hidden', !isHidden);
      }
      this._resizeHeader();
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
        if (this.oldPage !== null && this.oldPage !== undefined) {
          this.page = 0;
        }
        this.size = newSize;
      }
    }
  }, {
    key: '_handleSort',
    value: function _handleSort(event) {
      var column = event.detail.column;
      var paperDatatableApiThContent = event.currentTarget;
      var th = paperDatatableApiThContent.parentNode;
      var sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

      if (column.sortDirection === undefined || column.sortDirection === 'asc') {
        this.sortColumn(column, sortDirection, th);

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
      } else {
        this.deleteSortColumn(column, th);
      }
    }

    /**
     * Undo sort on a column if it is sorted.
     *
     * @property deleteSortColumn
     * @param {Object} column Column element.
     * @param {th} column Th element.
     */

  }, {
    key: 'deleteSortColumn',
    value: function deleteSortColumn(column, targetTh) {
      if (column.sortable && column.sorted) {
        var th = targetTh;

        if (!th) {
          th = Polymer.dom(this.root).querySelector('thead th[property="' + column.property + '"]');
        }

        if (th) {
          var thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
          thContent.setAttribute('sort-direction', 'asc');
          thContent.removeAttribute('sorted');
          column.set('sortDirection', undefined);
          column.set('sorted', false);
        }

        this.fire('sort', {
          sort: {},
          column: column
        });
      }
    }

    /**
     * Sort a column if it is sortable.
     *
     * @property sortColumn
     * @param {Object} column Column element.
     * @param {sortDirection} The sort direction.
     * @param {th} column Th element.
     */

  }, {
    key: 'sortColumn',
    value: function sortColumn(column, sortDirection, targetTh) {
      if (column.sortable) {
        var th = targetTh;
        var queryThContent = 'thead th paper-datatable-api-th-content[sortable][sorted]';
        Polymer.dom(this.root).querySelectorAll(queryThContent).forEach(function (otherThContent) {
          var thSorted = otherThContent.parentNode;

          if (thSorted.dataColumn !== column) {
            otherThContent.setAttribute('sort-direction', 'asc');
            otherThContent.removeAttribute('sorted');
            thSorted.dataColumn.set('sortDirection', undefined);
            thSorted.dataColumn.set('sorted', false);
          }
        });

        if (!th) {
          th = Polymer.dom(this.root).querySelector('thead th[property="' + column.property + '"]');
        }

        if (th) {
          var thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
          thContent.setAttribute('sort-direction', sortDirection);
          thContent.setAttribute('sorted', true);
          column.set('sortDirection', sortDirection);
          column.set('sorted', true);
        }
      }
    }
  }, {
    key: '_handleVaadinDatePickerLight',
    value: function _handleVaadinDatePickerLight(event) {
      var _this10 = this;

      var column = event.detail.column;
      var value = event.detail.value;

      this.async(function () {
        _this10._launchFilterEvent(value, column);
      });
    }
  }, {
    key: '_toggleFilter',
    value: function _toggleFilter(column) {
      Polymer.dom.flush();
      var columnIndex = this._columns.findIndex(function (_column) {
        return _column.property === column.property;
      });

      if (column.activeFilter) {
        this.set('_columns.' + columnIndex + '.activeFilter', false);
      } else {
        this.set('_columns.' + columnIndex + '.activeFilter', true);
      }
    }

    /**
     * Active filter on a column.
     *
     * @property activeFilter
     * @param {Object} column The column where the filer will be applied.
     * @param {String} value The value of the filter.
     */

  }, {
    key: 'activeFilter',
    value: function activeFilter(column, value) {
      var _this11 = this;

      if (column) {
        var columnIndex = this._columns.findIndex(function (_column) {
          return _column.property === column.property;
        });
        this.set('_columns.' + columnIndex + '.activeFilter', true);
        this.fire('filter', {
          filter: {
            property: column.property,
            value: value
          },
          column: column
        });
        this._resizeHeader();
        this.async(function () {
          if (value) {
            _this11.set('_columns.' + columnIndex + '.activeFilterValue', value);
          }
        }, 100);
      }
    }

    /**
     * Toggle filter on a column.
     *
     * @property toggleFilter
     * @param {Object} column The column where the filer will be applied.
     * @param {String} value The value of the filter.
     */

  }, {
    key: 'toggleFilter',
    value: function toggleFilter(column, value) {
      var _this12 = this;

      if (column) {
        this._toggleFilter(column);
        this.fire('filter', {
          filter: {
            property: column.property,
            value: value
          },
          column: column
        });
        this._resizeHeader();
        this.async(function () {
          if (value) {
            var columnIndex = _this12._columns.findIndex(function (_column) {
              return _column.property === column.property;
            });
            _this12.set('_columns.' + columnIndex + '.activeFilterValue', value);
          }
        }, 100);
      }
    }
  }, {
    key: '_launchFilterEvent',
    value: function _launchFilterEvent(value, column) {
      /**
       * Fired when a filters inputs changed.
       * @event filter
       * Event param: {{node: Object}} detail Contains sort object.
       * { filter: { property: STRING, value: STRING }, column: OBJECT }
       */
      this.fire('filter', {
        filter: {
          property: column.property,
          value: value
        },
        column: column
      });
    }
  }, {
    key: '_handleFilter',
    value: function _handleFilter(event) {
      var column = event.detail.column;

      if (column.activeFilter) {
        this._launchFilterEvent('', column);
      }
      this._toggleFilter(column);
    }
  }, {
    key: '_handleInputChange',
    value: function _handleInputChange(event) {
      var column = event.detail.column;
      var value = event.detail.value;

      if (column && value !== null && value !== undefined) {
        this._launchFilterEvent(value, column);
      }
    }
  }, {
    key: '_footerPositionChange',
    value: function _footerPositionChange(position) {
      var _this13 = this;

      this.async(function () {
        var footerDiv = Polymer.dom(_this13.root).querySelector('tfoot > tr > td > div > div');

        if (footerDiv) {
          if (position === 'right') {
            footerDiv.classList.add('end-justified');
          } else {
            footerDiv.classList.remove('end-justified');
          }
        }
      });
    }
  }, {
    key: '_addCustomTdClass',
    value: function _addCustomTdClass(isTdCustomStyle) {
      if (isTdCustomStyle) {
        return 'customTd';
      }
      return '';
    }
  }, {
    key: '_handleDragAndDrop',
    value: function _handleDragAndDrop() {
      var _this14 = this;

      var allTh = Polymer.dom(this.root).querySelectorAll('thead th');
      allTh.forEach(function (th) {
        th.addEventListener('dragover', _this14._dragOverHandle.bind(_this14), false);
        th.addEventListener('dragenter', _this14._dragEnterHandle.bind(_this14), false);
        th.addEventListener('drop', _this14._dropHandle.bind(_this14), false);
      });
      var allThDiv = Polymer.dom(this.root).querySelectorAll('thead th paper-datatable-api-th-content');
      allThDiv.forEach(function (div) {
        div.addEventListener('dragstart', _this14._dragStartHandle.bind(_this14), false);
        div.addEventListener('dragend', _this14._dragEndHandle.bind(_this14), false);
      });
    }
  }, {
    key: '_dragEndHandle',
    value: function _dragEndHandle() {
      this.currentDrag = undefined;
    }
  }, {
    key: '_dragEnterHandle',
    value: function _dragEnterHandle(event) {
      event.preventDefault();
      if (event.target.classList && event.target.classList.contains('pgTh')) {
        var from = this.currentDrag;
        var to = event.currentTarget;
        if (this._dragEnd) {
          this._moveTh(from, to);
        }
      }
    }
  }, {
    key: '_dragOverHandle',
    value: function _dragOverHandle(event) {
      event.preventDefault();
    }
  }, {
    key: '_dragStartHandle',
    value: function _dragStartHandle(event) {
      // Hack for firefox
      event.dataTransfer.setData('text/plain', '');

      this.currentDrag = event.currentTarget;
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    key: '_insertAfter',
    value: function _insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }, {
    key: '_insertBefore',
    value: function _insertBefore(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
  }, {
    key: '_insertElement',
    value: function _insertElement(container, toIndex, fromIndex) {
      if (toIndex > fromIndex) {
        this._insertAfter(container[toIndex], container[fromIndex]);
      } else {
        this._insertBefore(container[toIndex], container[fromIndex]);
      }
    }
  }, {
    key: '_moveTh',
    value: function _moveTh(from, to) {
      var _this15 = this;

      var fromProperty = from.parentNode.getAttribute('property');
      var toProperty = to.getAttribute('property');
      if (fromProperty !== toProperty) {
        this.async(function () {
          var allTh = Polymer.dom(_this15.root).querySelectorAll('thead th');
          var toIndex = allTh.findIndex(function (th) {
            return th.getAttribute('property') === toProperty;
          });
          var fromIndex = allTh.findIndex(function (th) {
            return th.getAttribute('property') === fromProperty;
          });
          _this15._insertElement(allTh, toIndex, fromIndex);

          var allTr = Polymer.dom(_this15.root).querySelectorAll('tbody tr');
          allTr.forEach(function (tr) {
            var allTd = Polymer.dom(tr).querySelectorAll('td');
            _this15._insertElement(allTd, toIndex, fromIndex);
          });

          _this15._resizeHeader();
          _this15._dragEnd = false;
          _this15.async(function () {
            _this15._dragEnd = true;
          }, 100);
        });
      }
    }
  }, {
    key: '_dropHandle',
    value: function _dropHandle() {
      this._generatePropertiesOrder();
    }
  }, {
    key: '_generatePropertiesOrder',
    value: function _generatePropertiesOrder() {
      var _this16 = this;

      Polymer.dom.flush();
      var allTh = Polymer.dom(this.root).querySelectorAll('thead th');
      var propertiesOrder = allTh.filter(function (th) {
        return th.getAttribute('property') !== null;
      }).map(function (th) {
        return th.getAttribute('property');
      });

      this.propertiesOrder = propertiesOrder;
      this.async(function () {
        return _this16._changeColumn(propertiesOrder, function () {
          return _this16.fire('order-column-change', { propertiesOrder: propertiesOrder });
        });
      }, 100);
    }

    /**
     * Change column order.
     *
     * @property changeColumnOrder
     * @param {Object} propertiesOrder The sorted columns properties.
     */

  }, {
    key: 'changeColumnOrder',
    value: function changeColumnOrder(propertiesOrder) {
      this.propertiesOrder = propertiesOrder;
      this._init(this.data, propertiesOrder);
      this.fire('order-column-change', { propertiesOrder: propertiesOrder });
    }
  }, {
    key: '_changeColumn',
    value: function _changeColumn(propertiesOrder, cb) {
      var _this17 = this;

      if (propertiesOrder) {
        var newColumnsOrder = [];
        propertiesOrder.forEach(function (property) {
          var columnObj = _this17._columns.find(function (column) {
            return column.property === property;
          });
          if (columnObj) {
            newColumnsOrder.push(columnObj);
          }
        });
        if (newColumnsOrder.length > 0) {
          this.splice('_columns', 0, this._columns.length);
          this.async(function () {
            _this17._columns = newColumnsOrder;
            _this17._resizeHeader();
            _this17.async(function () {
              _this17._handleDragAndDrop();
              if (cb) {
                cb();
              }
            });
          });
        } else if (cb) {
          cb();
        }
      } else if (cb) {
        cb();
      }
    }

    /**
     * Get a column following his property name.
     *
     * @property getColumn
     * @param {Object} property The property.
     */

  }, {
    key: 'getColumn',
    value: function getColumn(property) {
      return this._columns.find(function (columnElement) {
        return columnElement.property === property;
      });
    }

    /**
     * Scroll to top.
     *
     * @property scrollTopTop
     */

  }, {
    key: 'scrollToTop',
    value: function scrollToTop() {
      if (this.frozenHeader) {
        Polymer.dom(this.root).querySelector('#wrapper').scrollTop = 0;
      } else {
        Polymer.dom(this.root).querySelector('tbody').scrollTop = 0;
      }
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior, Polymer.IronResizableBehavior];
    }
  }]);

  return DtPaperDatatableApi;
}();

Polymer(DtPaperDatatableApi);