/* global customElements */
class DtPaperDatatableApi extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior, Polymer.IronResizableBehavior],
  Polymer.MutableData(Polymer.Element)
) {
  static get is() {
    return 'paper-datatable-api';
  }

  static get properties() {
    return {
      _columns: {
        type: Array,
        value: () => [],
      },
      /**
       * The list of hideable columns.
       * It is exposed to create a list of label (see demo/advance-demo.html).
       */
      toggleColumns: {
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
        observer: '_pageChanged',
      },
      /**
       * The current size.
       */
      size: {
        type: Number,
        notify: true,
      },
      /**
       * The current sort.
       */
      sort: {
        type: String,
        notify: true,
      },
      /**
       * If true, a filter on each column is added.
       */
      filters: {
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
      /**
       * If true, the rows may be selectable.
       */
      selectable: {
        type: Boolean,
        value: false,
      },
      /**
       * If false, the paper-checkbox in the header which allow to select all rows is hidden.
       */
      allowTheSelectionOfAllTheElements: {
        type: Boolean,
        value: true,
      },
      /**
       * Contains the positions of selected columns.
       * Can contain a specific data if selectableDataKey is setted.
       */
      selectedRows: {
        type: Array,
        value: () => [],
        notify: true,
      },
      /**
       * If it is setted, the selected rows are persistant (throught the pages).
       * Uses the value of the rowData following the defined key.
       */
      selectableDataKey: {
        type: String,
      },
      /**
       * Change the position of the sort icon in the header.
       */
      positionSortIcon: {
        type: String,
        value: 'left',
      },
      language: {
        type: String,
        value: 'en',
      },
      resources: {
        notify: true,
        value() {
          return {
            en: {
              rowPerPage: 'Rows per page',
              of: 'of',
            },
            'en-en': {
              rowPerPage: 'Rows per page',
              of: 'of',
            },
            'en-US': {
              rowPerPage: 'Rows per page',
              of: 'of',
            },
            'en-us': {
              rowPerPage: 'Rows per page',
              of: 'of',
            },
            fr: {
              rowPerPage: 'Ligne par page ',
              of: 'sur',
            },
            'fr-fr': {
              rowPerPage: 'Ligne par page ',
              of: 'sur',
            },
          };
        },
      },
      /**
       * Change the position of the footer.
       */
      footerPosition: {
        type: String,
        value: 'right',
      },
      /**
       * Checkbox column position.
       */
      checkboxColumnPosition: {
        type: Number,
        value: 0,
      },
      _dragEnd: {
        type: Boolean,
        value: true,
      },
      /**
       * Order of the columns
       */
      propertiesOrder: {
        type: Array,
        value: [],
        notify: true,
      },
      /**
       * The number of the previous page
       */
      oldPage: {
        type: Number,
        notify: true,
      },
      /**
       * Date format for datepicker
       */
      dateFormat: {
        type: String,
        value: 'MM/DD/YYYY',
      },
    };
  }

  get behaviors() {
    return [Polymer.AppLocalizeBehavior];
  }

  static get observers() {
    return ['_sortChanged(_columns, sort)'];
  }

  attached() {
    const userLang = navigator.language || navigator.userLanguage;
    this.language = userLang;
  }

  equals(targetedValue, value) {
    return value === targetedValue;
  }

  _generateClass(filters, paginate) {
    if (filters && paginate) {
      return 'paginate filters';
    }
    if (filters) {
      return 'filters';
    }
    if (paginate) {
      return 'paginate';
    }
    return '';
  }

  _init(data, propertiesOrder) {
    this._changeColumn(propertiesOrder, () => {
      this.async(() => {
        this._removeRows();
        this._fillRows(data);
        this._fillColumns();
        this._footerPositionChange(this.footerPosition);
        this._handleDragAndDrop();
      });
    });
  }

  _dataChanged(data) {
    if (this._observer) {
      Polymer.dom(this).unobserveNodes(this._observer);
    }
    this._observer = Polymer.dom(this).observeNodes(this._setColumns.bind(this));
    this._init(data, this.propertiesOrder);
  }

  _pageChanged(page, oldPage) {
    this.oldPage = oldPage;
  }

  _removeRows() {
    const pgTrs = this.shadowRoot.querySelectorAll('.paper-datatable-api-tr');
    pgTrs.forEach(pgTr => Polymer.dom(this.shadowRoot.querySelector('tbody')).removeChild(pgTr));
  }

  _fillRows(data) {
    if (data) {
      data.forEach((rowData) => {
        const trLocal = document.createElement('tr');
        trLocal.rowData = rowData;
        trLocal.className = 'paper-datatable-api-tr';

        this.listen(trLocal, 'mouseover', 'onOverTr');
        this.listen(trLocal, 'mouseout', 'onOutTr');
        this.listen(trLocal, 'tap', 'onTapTr');

        Polymer.dom(this.shadowRoot.querySelector('tbody')).appendChild(trLocal);
      });
    }
  }

  onTapTr(e) {
    this.dispatchEvent(new CustomEvent('tap-tr', { detail: { row: e.currentTarget.rowData } }));
  }

  onOverTd(e) {
    this.fire('td-over', e.currentTarget);
  }

  onOutTd(e) {
    this.fire('td-out', e.currentTarget);
  }

  onOverTr(e) {
    this.fire('tr-over', e.currentTarget);
  }

  onOutTr(e) {
    this.fire('tr-out', e.currentTarget);
  }

  _findSelectableElement(rowData) {
    const splittedSelectableDataKey = this.selectableDataKey.split('.');
    let selectedRow = rowData;
    splittedSelectableDataKey.forEach((selectableDataKey) => {
      selectedRow = selectedRow[selectableDataKey];
    });

    return selectedRow;
  }

  _fillColumns() {
    const pgTrs = this.shadowRoot.querySelectorAll('.paper-datatable-api-tr');

    pgTrs.forEach((pgTr, i) => {
      const rowData = pgTr.rowData;

      this._columns.forEach((paperDatatableApiColumn, p) => {
        if (this.selectable && p === this.checkboxColumnPosition) {
          const tdSelectable = document.createElement('td');
          tdSelectable.className = 'selectable';
          const paperCheckbox = document.createElement('paper-checkbox');
          this.listen(paperCheckbox, 'change', '_selectChange');
          paperCheckbox.rowData = rowData;
          paperCheckbox.rowIndex = i;

          if (this.selectableDataKey !== undefined) {
            const selectedRow = this._findSelectableElement(rowData);
            if (selectedRow !== undefined && this.selectedRows.indexOf(selectedRow) !== -1) {
              paperCheckbox.checked = true;
            }
          }

          tdSelectable.appendChild(paperCheckbox);
          pgTr.appendChild(tdSelectable);
          Polymer.dom.flush();
        }

        const valueFromRowData = this._extractData(rowData, paperDatatableApiColumn.property);

        const otherPropertiesValue = {};
        paperDatatableApiColumn.otherProperties.forEach((property) => {
          otherPropertiesValue[property] = this._extractData(rowData, property);
        });

        const tdLocal = document.createElement('td');
        if (paperDatatableApiColumn.tdCustomStyle) {
          tdLocal.classList.add('customTd');
        }

        this.listen(tdLocal, 'mouseover', 'onOverTd');
        this.listen(tdLocal, 'mouseout', 'onOutTd');

        const instance = paperDatatableApiColumn.fillTemplate(
          valueFromRowData,
          otherPropertiesValue
        );

        if (paperDatatableApiColumn.hideable && paperDatatableApiColumn.hidden) {
          tdLocal.style.display = 'none';
        }

        tdLocal.appendChild(instance.root);
        pgTr.appendChild(tdLocal);
      });
    });
  }

  _selectAllCheckbox(event) {
    const localTarget = Polymer.dom(event).localTarget;
    const allPaperCheckbox = this.shadowRoot.querySelectorAll('tbody tr td paper-checkbox');
    allPaperCheckbox.forEach((paperCheckboxParams) => {
      const paperCheckbox = paperCheckboxParams;
      if (localTarget.checked) {
        if (!paperCheckbox.checked) {
          paperCheckbox.checked = true;
          this._selectChange(paperCheckbox);
        }
      } else if (paperCheckbox.checked) {
        paperCheckbox.checked = false;
        this._selectChange(paperCheckbox);
      }
    });
  }

  /**
   * Check the checkbox
   *
   * @property selectRow
   * @param {String} value The value of the row following the selectableDatakey.
   */
  selectRow(value) {
    const table = this.$$('table');
    const allTr = table.querySelectorAll('tbody tr');
    allTr.forEach((tr) => {
      const selectedRow = this._findSelectableElement(tr.rowData);
      if (!this.selectable) {
        tr.classList.remove('selected');
      }
      if (selectedRow === value) {
        const checkbox = tr.querySelector('paper-checkbox');
        if (checkbox) {
          checkbox.checked = true;

          let rowId = checkbox.rowIndex;
          if (this.selectableDataKey !== undefined && selectedRow !== undefined) {
            rowId = selectedRow;
          }
          this.push('selectedRows', rowId);
        }
        tr.classList.add('selected');
      }
    });
  }

  _selectChange(event) {
    let localTarget;
    if (event.type && event.type === 'change') {
      localTarget = Polymer.dom(event).localTarget;
    } else {
      localTarget = event;
    }

    const tr = Polymer.dom(localTarget).parentNode.parentNode;

    const rowData = localTarget.rowData;

    let rowId = localTarget.rowIndex;

    if (this.selectableDataKey !== undefined) {
      const selectedRow = this._findSelectableElement(rowData);
      if (selectedRow) {
        rowId = selectedRow;
      }
    }

    let eventData = {};

    const selectedRows = [...this.selectedRows];

    if (localTarget.checked) {
      selectedRows.push(rowId);
      eventData = {
        selected: [rowId],
        data: rowData,
      };
      tr.classList.add('selected');
    } else {
      selectedRows.splice(selectedRows.indexOf(rowId), 1);
      eventData = {
        deselected: [rowId],
        data: rowData,
      };
      tr.classList.remove('selected');
    }

    this.set('selectedRows', selectedRows);

    /**
     * Fired when a row is selected.
     * @event selection-changed
     * Event param: {{node: Object}} detail Contains selected id and row data.
     */
    this.fire('selection-changed', eventData);
  }

  _extractData(rowData, columnProperty) {
    if (columnProperty) {
      const splittedProperties = columnProperty.split('.');
      if (splittedProperties.length > 1) {
        return splittedProperties.reduce((prevRow, property) => {
          if (typeof prevRow === 'string' && rowData[prevRow] && rowData[prevRow][property]) {
            return rowData[prevRow][property];
          }

          return prevRow[property] || '';
        });
      }
      return rowData[columnProperty];
    }
    return null;
  }

  _setColumns() {
    let generateTr = false;

    if (this._columns.length > 0) {
      generateTr = true;
    }

    this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column').map(
      (columnParams, i) => {
        const column = columnParams;
        column.position = i;
        return column;
      }
    );

    if (this.propertiesOrder.length === 0) {
      this._generatePropertiesOrder();
    }

    const columns = [...this._columns];
    this.set(
      'toggleColumns',
      columns.filter(column => column.hideable || column.draggableColumn).map(column => ({
        position: column.position,
        hideable: column.hideable,
        hidden: column.hidden,
        property: column.property,
        header: column.header,
      }))
    );

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
  toggleColumn(columnProperty) {
    const column = this._columns.find(columnElement => columnElement.property === columnProperty);
    const index = this._columns.findIndex(
      columnElement => columnElement.property === columnProperty
    );
    if (column && column.hideable) {
      const isHidden = column.hidden;
      const indexColumn = this.selectable ? index + 2 : index + 1;
      const cssQuery = `thead tr th:nth-of-type(${indexColumn}), tbody tr td:nth-of-type(${indexColumn})`;
      this.shadowRoot.querySelectorAll(cssQuery).forEach((tdThParams) => {
        const tdTh = tdThParams;
        tdTh.style.display = isHidden ? 'table-cell' : 'none';
      });

      column.hidden = !isHidden;
      const toggleColumns = [...this.toggleColumns];
      const toggleColumnIndex = toggleColumns.findIndex(
        toggleColumn => toggleColumn.property === columnProperty
      );

      toggleColumns[toggleColumnIndex].hidden = !isHidden;

      this.set('toggleColumns', toggleColumns);
      this._setColumns();
    }
  }

  _getThDisplayStyle(hidden) {
    if (hidden) {
      return 'none';
    }

    return 'table-cell';
  }

  _sortChanged(columns, sort) {
    if (sort) {
      const splittedSort = sort.split(',');
      if (splittedSort && splittedSort.length > 0 && splittedSort[0] && splittedSort[1]) {
        const [property, direction] = splittedSort;
        const column = columns.find(
          columnElement => columnElement.property === property
        );
        const th = [...this.shadowRoot.querySelectorAll('th')].find(
          thTarget => thTarget.property === property
        );
        if (column) {
          this.sortColumn(column, direction, th);
        }
      }
    } else {
      [...this.shadowRoot.querySelectorAll('th')].forEach((th) => {
        const column = [...columns].find(
          columnElement => columnElement.property === th.getAttribute('property')
        );
        if (column && column.sortable && column.sorted) {
          const thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
          thContent.setAttribute('sort-direction', 'asc');
          thContent.removeAttribute('sorted');
          column.set('sortDirection', undefined);
          column.set('sorted', false);
          this.fire('sort', {
            sort: {},
            column,
          });
        }
      });
    }
  }

  _handleSort({ detail, currentTarget }) {
    const column = detail.column;
    const paperDatatableApiThContent = currentTarget;
    const th = paperDatatableApiThContent.parentNode;
    const sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

    if (column.sortDirection === undefined || column.sortDirection === 'asc') {
      this.set('sort', `${column.property},${sortDirection}`);

      /**
       * Fired when a column is sorted.
       * @event sort
       * Event param: {{node: Object}} detail Contains sort object.
       * { sort: { property: STRING, direction: asc|desc }, column: OBJECT }
       */
      this.fire('sort', {
        sort: {
          property: column.property,
          direction: column.sortDirection,
        },
        column,
      });
    } else {
      this.set('sort', null);
    }
  }

  /**
   * Undo sort on a column if it is sorted.
   *
   * @property deleteSortColumn
   * @param {Object} column Column element.
   * @param {th} column Th element.
   */
  deleteSortColumn(column, targetTh) {
    if (column.sortable && column.sorted) {
      let th = targetTh;

      if (!th) {
        th = this.shadowRoot.querySelector(`thead th[property="${column.property}"]`);
      }

      if (th) {
        const thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
        thContent.setAttribute('sort-direction', 'asc');
        thContent.removeAttribute('sorted');
        column.set('sortDirection', undefined);
        column.set('sorted', false);
      }

      this.fire('sort', {
        sort: {},
        column,
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
  sortColumn(column, sortDirection, targetTh) {
    if (column && column.sortable) {
      let th = targetTh;
      const queryThContent = 'thead th paper-datatable-api-th-content[sortable][sorted]';
      this.shadowRoot.querySelectorAll(queryThContent).forEach((otherThContent) => {
        const thSorted = otherThContent.parentNode;

        if (thSorted.dataColumn !== column) {
          otherThContent.setAttribute('sort-direction', 'asc');
          otherThContent.removeAttribute('sorted');
          thSorted.dataColumn.set('sortDirection', undefined);
          thSorted.dataColumn.set('sorted', false);
        }
      });

      if (!th) {
        th = this.shadowRoot.querySelector(`thead th[property="${column.property}"]`);
      }

      if (th) {
        const thContent = Polymer.dom(th).querySelector('paper-datatable-api-th-content');
        thContent.setAttribute('sort-direction', sortDirection);
        thContent.setAttribute('sorted', true);
        column.set('sortDirection', sortDirection);
        column.set('sorted', true);
      }
    }
  }

  _handleDateChange(event) {
    const column = event.detail.column;
    const value = event.detail.value;

    this.async(() => {
      this._launchFilterEvent(value, column);
    });
  }

  _toggleFilter(column) {
    this.async(() => {
      const columnIndex = this._columns.findIndex(_column => _column.property === column.property);

      if (column.activeFilter) {
        this._columns[columnIndex].activeFilter = false;
        this.notifyPath(`_columns.${columnIndex}.activeFilter`);
      } else {
        this._columns[columnIndex].activeFilter = true;
        this.notifyPath(`_columns.${columnIndex}.activeFilter`);
      }
    });
  }

  /**
   * Active filter on a column.
   *
   * @property activeFilter
   * @param {Object} column The column where the filer will be applied.
   * @param {String} value The value of the filter.
   */
  activeFilter(column, value) {
    if (column) {
      const columnIndex = this._columns.findIndex(_column => _column.property === column.property);
      this._columns[columnIndex].activeFilter = true;
      this.notifyPath(`_columns.${columnIndex}.activeFilter`);
      this.fire('filter', {
        filter: {
          property: column.property,
          value,
        },
        column,
      });
      this.async(() => {
        if (value) {
          this._columns[columnIndex].activeFilterValue = value;
          this.notifyPath(`_columns.${columnIndex}.activeFilterValue`);
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
  toggleFilter(column, value) {
    if (column) {
      this._toggleFilter(column);
      this.fire('filter', {
        filter: {
          property: column.property,
          value,
        },
        column,
      });
      this.async(() => {
        if (value) {
          const columnIndex = this._columns.findIndex(
            _column => _column.property === column.property
          );
          this._columns[columnIndex].activeFilterValue = value;
          this.notifyPath(`_columns.${columnIndex}.activeFilterValue`);
        }
      }, 100);
    }
  }

  _launchFilterEvent(value, column) {
    /**
     * Fired when a filters inputs changed.
     * @event filter
     * Event param: {{node: Object}} detail Contains sort object.
     * { filter: { property: STRING, value: STRING }, column: OBJECT }
     */
    this.fire('filter', {
      filter: {
        property: column.property,
        value,
      },
      column,
    });
  }

  _handleFilter(event) {
    const column = event.detail.column;

    this._toggleFilter(column);

    if (column.activeFilter) {
      this.async(() => {
        this._launchFilterEvent('', column);
      });
    }
  }

  _handleInputChange(event) {
    const column = event.detail.column;
    const value = event.detail.value;

    if (column && value !== null && value !== undefined) {
      this._launchFilterEvent(value, column);
    }
  }

  _footerPositionChange(position) {
    this.async(() => {
      const footerDiv = this.shadowRoot.querySelector('.foot > div > div');

      if (footerDiv) {
        if (position === 'right') {
          footerDiv.classList.add('end-justified');
        } else {
          footerDiv.classList.remove('end-justified');
        }
      }
    });
  }

  _addCustomTdClass(isTdCustomStyle) {
    if (isTdCustomStyle) {
      return 'customTd';
    }
    return '';
  }

  _handleDragAndDrop() {
    const allTh = this.shadowRoot.querySelectorAll('thead th');
    allTh.forEach((th) => {
      th.addEventListener('dragover', this._dragOverHandle.bind(this), false);
      th.addEventListener('dragenter', this._dragEnterHandle.bind(this), false);
      th.addEventListener('drop', this._dropHandle.bind(this), false);
    });
    const allThDiv = this.shadowRoot.querySelectorAll('thead th paper-datatable-api-th-content');
    allThDiv.forEach((div) => {
      div.addEventListener('dragstart', this._dragStartHandle.bind(this), false);
      div.addEventListener('dragend', this._dragEndHandle.bind(this), false);
    });
  }

  _dragEndHandle() {
    this.currentDrag = undefined;
  }

  _dragEnterHandle(event) {
    event.preventDefault();
    if (event.target.classList && event.target.classList.contains('pgTh')) {
      const from = this.currentDrag;
      const to = event.currentTarget;
      if (this._dragEnd) {
        this._moveTh(from, to);
      }
    }
  }

  _dragOverHandle(event) {
    event.preventDefault();
  }

  _dragStartHandle(event) {
    // Hack for firefox
    event.dataTransfer.setData('text/plain', '');

    this.currentDrag = event.currentTarget;
    event.dataTransfer.effectAllowed = 'move';
  }

  _insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  _insertBefore(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  }

  _insertElement(container, toIndex, fromIndex) {
    if (toIndex > fromIndex) {
      this._insertAfter(container[toIndex], container[fromIndex]);
    } else {
      this._insertBefore(container[toIndex], container[fromIndex]);
    }
  }

  _moveTh(from, to) {
    const fromProperty = from.parentNode.getAttribute('property');
    const toProperty = to.getAttribute('property');
    if (fromProperty !== toProperty) {
      this.async(() => {
        const allTh = this.shadowRoot.querySelectorAll('thead th');
        const allThArray = Array.prototype.slice.call(allTh);
        const toIndex = allThArray.findIndex(th => th.getAttribute('property') === toProperty);
        const fromIndex = allThArray.findIndex(th => th.getAttribute('property') === fromProperty);
        this._insertElement(allTh, toIndex, fromIndex);

        const allTr = this.shadowRoot.querySelectorAll('tbody tr');
        allTr.forEach((tr) => {
          const allTd = Polymer.dom(tr).querySelectorAll('td');
          this._insertElement(allTd, toIndex, fromIndex);
        });

        this._dragEnd = false;
        this.async(() => {
          this._dragEnd = true;
        }, 100);
      });
    }
  }

  _dropHandle() {
    this._generatePropertiesOrder();
  }

  _generatePropertiesOrder() {
    Polymer.dom.flush();
    const allTh = this.shadowRoot.querySelectorAll('thead th');

    const propertiesOrder = Array.prototype.filter
      .call(allTh, th => th.getAttribute('property') !== null)
      .map(th => th.getAttribute('property'));

    this.propertiesOrder = propertiesOrder;
    this.async(
      () =>
        this._changeColumn(propertiesOrder, () =>
          this.fire('order-column-change', { propertiesOrder })
        ),
      100
    );
  }

  /**
   * Change column order.
   *
   * @property changeColumnOrder
   * @param {Object} propertiesOrder The sorted columns properties.
   */
  changeColumnOrder(propertiesOrder) {
    this.propertiesOrder = propertiesOrder;
    this._init(this.data, propertiesOrder);
    this.fire('order-column-change', { propertiesOrder });
  }

  _changeColumn(propertiesOrder, cb) {
    if (propertiesOrder) {
      const newColumnsOrder = [];
      propertiesOrder.forEach((property) => {
        const columnObj = this._columns.find(column => column.property === property);
        if (columnObj) {
          newColumnsOrder.push(columnObj);
        }
      });
      if (newColumnsOrder.length > 0) {
        this.splice('_columns', 0, this._columns.length);
        this.async(() => {
          this._columns = newColumnsOrder;
          this.async(() => {
            this._handleDragAndDrop();

            const columns = [...this._columns];
            this.set(
              'toggleColumns',
              columns.filter(column => column.hideable || column.draggableColumn).map(column => ({
                position: column.position,
                hideable: column.hideable,
                hidden: column.hidden,
                property: column.property,
                header: column.header,
              }))
            );
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
  getColumn(property) {
    return this._columns.find(columnElement => columnElement.property === property);
  }

  /**
   * Scroll to top.
   *
   * @property scrollTopTop
   */
  scrollToTop() {
    this.shadowRoot.querySelector('tbody').scrollTop = 0;
  }
}

customElements.define(DtPaperDatatableApi.is, DtPaperDatatableApi);
