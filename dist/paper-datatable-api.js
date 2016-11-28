'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
        timeoutFilter: Number,
        /**
         * Change the position of the footer.
         */
        footerPosition: {
          type: String,
          value: 'right'
        },
        /**
         * Checkbox column position
         */
        checkboxColumnPosition: {
          type: Number,
          value: 0
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
        var _ret = function () {
          var allTheadTrTh = frozenHeaderTable.querySelectorAll('thead tr th');
          return {
            v: Object.keys(allTheadTrTh).map(function (headerThIndex) {
              return allTheadTrTh[headerThIndex].offsetWidth;
            })
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      return null;
    }
  }, {
    key: '_getTbodyWidths',
    value: function _getTbodyWidths() {
      var table = this.$$('table:not(#frozenHeaderTable)');
      var tbody = table.querySelector('tbody tr');

      if (tbody) {
        var _ret2 = function () {
          var allTbodyTd = tbody.querySelectorAll('td');
          return {
            v: Object.keys(allTbodyTd).map(function (bodyTdIndex) {
              return allTbodyTd[bodyTdIndex].offsetWidth;
            })
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
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
    value: function _computeCurrentMaxSize(page, size) {
      var maxSize = size * (page + 1);
      return maxSize > this.totalElements ? this.totalElements : maxSize;
    }
  }, {
    key: '_dataChanged',
    value: function _dataChanged(data) {
      var _this4 = this;

      this.async(function () {
        _this4._removeRows();
        _this4._fillRows(data);
        _this4._fillColumns();
        _this4._resizeHeader();
        _this4._footerPositionChange(_this4.footerPosition);
      });
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
      var _this10 = this;

      var column = this._columns[columnPosition];
      if (column && column.hideable) {
        (function () {
          var isHidden = column.hidden;
          var indexColumn = _this10.selectable ? columnPosition + 2 : columnPosition + 1;
          var cssQuery = 'tr th:nth-of-type(' + indexColumn + '), tr td:nth-of-type(' + indexColumn + ')';
          Polymer.dom(_this10.root).querySelectorAll(cssQuery).forEach(function (tdThParams) {
            var tdTh = tdThParams;
            tdTh.style.display = isHidden ? 'table-cell' : 'none';
          });

          column.hidden = !isHidden;
          var toggleColumnIndex = _this10.toggleColumns.findIndex(function (toggleColumn) {
            return toggleColumn.position === columnPosition;
          });

          _this10.set('toggleColumns.' + toggleColumnIndex + '.hidden', !isHidden);
        })();
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
      var column = event.model.column;
      var paperIconButton = event.currentTarget;
      var th = paperIconButton.parentNode.parentNode;
      var sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

      if (column.sortDirection === undefined || column.sortDirection === 'asc') {
        this.sortColumn(column, sortDirection, th);
      } else {
        this.deleteSortColumn(column, th);
      }

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

    /**
     * Undo sort on a column if it is sorted.
     *
     * @property toggleColumn
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
          th.setAttribute('sort-direction', 'asc');
          th.removeAttribute('sorted');
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
     * @property toggleColumn
     * @param {Object} column Column element.
     * @param {sortDirection} The sort direction.
     * @param {th} column Th element.
     */

  }, {
    key: 'sortColumn',
    value: function sortColumn(column, sortDirection, targetTh) {
      if (column.sortable) {
        var th = targetTh;
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

        if (!th) {
          th = Polymer.dom(this.root).querySelector('thead th[property="' + column.property + '"]');
        }

        if (th) {
          th.setAttribute('sort-direction', sortDirection);
          th.setAttribute('sorted', true);
          column.set('sortDirection', sortDirection);
          column.set('sorted', true);
        }
      }
    }
  }, {
    key: '_handleActiveFilterChange',
    value: function _handleActiveFilterChange(event) {
      var _this11 = this;

      var parentDiv = event.currentTarget.parentNode;
      this.async(function () {
        var paperInput = parentDiv.querySelector(':scope > paper-input');
        if (paperInput) {
          paperInput.focus();
        } else {
          var datePicker = parentDiv.querySelector('vaadin-date-picker-light');
          if (datePicker) {
            paperInput = datePicker.querySelector('paper-input');
            datePicker.i18n = _this11.localeDatePicker;
          }
        }
      });
    }
  }, {
    key: '_handlePaperInputChange',
    value: function _handlePaperInputChange(event) {
      var _this12 = this;

      var column = event.model.column;
      var input = event.currentTarget;

      this.async(function () {
        if (input.value !== '') {
          _this12._launchFilterEvent(input, column);
        } else if (!input.focused) {
          _this12._toggleFilter(column);
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
      var _this13 = this;

      var column = event.model.column;
      var input = event.currentTarget;

      this.async(function () {
        if (input.value !== '') {
          _this13._launchFilterEvent(input, column);
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
      var _this14 = this;

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
          var paperInput = Polymer.dom(_this14.root).querySelector('thead th[property="' + column.property + '"] paper-input');
          if (paperInput !== null) {
            paperInput.value = value;
          }
        }, 100);
      }
    }

    /**
     * Toggle filter on a column.
     *
     * @property activeFilter
     * @param {Object} column The column where the filer will be applied.
     * @param {String} value The value of the filter.
     */

  }, {
    key: 'toggleFilter',
    value: function toggleFilter(column, value) {
      var _this15 = this;

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
          var paperInput = Polymer.dom(_this15.root).querySelector('thead th[property="' + column.property + '"] paper-input');
          if (paperInput !== null) {
            paperInput.value = value;
          }
        }, 100);
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
        input.previousValue = input.value;
        this._launchFilterEvent(input, column);
      }
      this._toggleFilter(column);
    }
  }, {
    key: '_handleKeyDownInput',
    value: function _handleKeyDownInput(event) {
      var _this16 = this;

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
              _this16._launchFilterEvent(input, column);
            }
            input.previousValue = input.value;
          }, 1000);
        }
      }
    }
  }, {
    key: '_footerPositionChange',
    value: function _footerPositionChange(position) {
      var footerDiv = Polymer.dom(this.root).querySelector('tfoot > tr > td > div > div');

      if (footerDiv) {
        if (position === 'right') {
          footerDiv.classList.add('end-justified');
        } else {
          footerDiv.classList.remove('end-justified');
        }
      }
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
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior, Polymer.IronResizableBehavior];
    }
  }]);

  return DtPaperDatatableApi;
}();

Polymer(DtPaperDatatableApi);