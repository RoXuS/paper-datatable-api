class DtPaperDatatableApi {

  beforeRegister() {
    this.is = 'paper-datatable-api';
    this.properties = {
      /**
       * The columns element.
       */
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
      /**
       * If it is setted, the date picker is localized with this object.
       * See https://vaadin.com/docs/-/part/elements/vaadin-date-picker/vaadin-date-picker-localization.html.
       */
      localeDatePicker: {
        type: Object,
      },
      frozenHeader: {
        type: Boolean,
        value: false,
      },
      resources: {
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
    };

    this.listeners = {
      'iron-resize': '_resizeHeader',
    };
  }

  get behaviors() {
    return [
      Polymer.AppLocalizeBehavior,
      Polymer.IronResizableBehavior,
    ];
  }

  /** Frozen Mode **/

  _resizeHeader() {
    this.async(() => {
      if (this.frozenHeader) {
        let bodyWidth = this._getTbodyWidths();
        let headerWidth = this._getTheadWidths();

        if (headerWidth && bodyWidth) {
          /**
           * Set all width to auto.
           */
          this._resizeAllWidthToAuto(bodyWidth);
          /**
           * Resize header width following body width.
           */
          this._resizeWidth(bodyWidth, headerWidth, 'header');
          bodyWidth = this._getTbodyWidths();
          headerWidth = this._getTheadWidths();
          /**
           * Resize body width following header width.
           */
          this._resizeWidth(headerWidth, bodyWidth, 'body');
          bodyWidth = this._getTbodyWidths();
          headerWidth = this._getTheadWidths();
          /**
           * Reajust header width with the new width of body.
           */
          this._resizeWidth(bodyWidth, headerWidth, 'header', true);
        }
        this.fire('end-of-resize', { });
      }
    }, 10);
  }

  _resizeAllWidthToAuto(bodyWidth) {
    bodyWidth.forEach((bodyTrWidth, index) => {
      this._resizeTd('auto', index, 'header');
      this._resizeTd('auto', index, 'body');
    });
  }

  _resizeWidth(iterateArray, arrayWidth, type, force = false) {
    iterateArray.forEach((width, index) => {
      if (width > arrayWidth[index] || force) {
        this._resizeTd(width, index, type);
      }
    });
  }

  _getTheadWidths() {
    const frozenHeaderTable = this.$$('#frozenHeaderTable');
    if (frozenHeaderTable) {
      const allTheadTrTh = frozenHeaderTable.querySelectorAll('thead tr th');
      return Object.keys(allTheadTrTh).map(
        headerThIndex => allTheadTrTh[headerThIndex].offsetWidth
      );
    }
    return null;
  }

  _getTbodyWidths() {
    const table = this.$$('table:not(#frozenHeaderTable)');
    const tbody = table.querySelector('tbody tr');

    if (tbody) {
      const allTbodyTd = tbody.querySelectorAll('td');
      return Object.keys(allTbodyTd).map(bodyTdIndex => allTbodyTd[bodyTdIndex].offsetWidth);
    }
    return null;
  }

  _resizeTd(size, columnIndex, type) {
    let allTheadTrTh = this.$$('tbody tr').querySelectorAll('td');
    if (type === 'header') {
      allTheadTrTh = this.$$('#frozenHeaderTable thead tr').querySelectorAll('th');
    }

    if (allTheadTrTh.length > 0) {
      const paddingLeftPx = window.getComputedStyle(allTheadTrTh[columnIndex]).paddingLeft;
      const paddingLeft = paddingLeftPx.split('px')[0];
      const paddingRightPx = window.getComputedStyle(allTheadTrTh[columnIndex]).paddingRight;
      const paddingRight = paddingRightPx.split('px')[0];
      const horizontalPadding = parseInt(paddingRight, 10) + parseInt(paddingLeft, 10);

      if (size !== 'auto' && (size - horizontalPadding) !== 0) {
        const sizeWithoutPad = size - horizontalPadding;
        Polymer.dom(allTheadTrTh[columnIndex]).firstElementChild.style.width = `${sizeWithoutPad}px`;
      } else if (size === 'auto') {
        Polymer.dom(allTheadTrTh[columnIndex]).firstElementChild.style.width = 'auto';
      }
    }
  }

  _handleWrapperScroll(event) {
    if (this.frozenHeader) {
      this.$$('#headerWrapper').scrollLeft = event.target.scrollLeft;
    }
  }

  /** End of frozen mode **/

  attached() {
    const userLang = navigator.language || navigator.userLanguage;
    this.language = userLang;
  }

  equals(targetedValue, value) {
    return value === targetedValue;
  }

  _generateClass(frozenHeader, filters, paginate) {
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

  _nextPage() {
    if ((this.page + 1) < this.totalPages) {
      this.page = this.page + 1;
    }
  }

  _prevPage() {
    if (this.page > 0) {
      this.page = this.page - 1;
    }
  }

  _nextButtonEnabled(page, totalPages) {
    return (page + 1) < totalPages;
  }

  _prevButtonEnabled(page) {
    return page > 0;
  }

  _computeCurrentSize(page, size) {
    return (page * size) + 1;
  }

  _computeCurrentMaxSize(page, size, totalElements) {
    const maxSize = size * (page + 1);
    return (maxSize > totalElements ? totalElements : maxSize);
  }

  _init(data, propertiesOrder) {
    this._changeColumn(propertiesOrder, () => {
      this.async(() => {
        this._removeRows();
        this._fillRows(data);
        this._fillColumns();
        this._resizeHeader();
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
    const pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
    pgTrs.forEach(pgTr => Polymer.dom(this.$$('tbody')).removeChild(pgTr));
  }

  _fillRows(data) {
    if (data) {
      data.forEach((rowData) => {
        const trLocal = document.createElement('tr');
        trLocal.rowData = rowData;
        trLocal.className = 'paper-datatable-api-tr';

        this.listen(trLocal, 'mouseover', 'onOverTr');
        this.listen(trLocal, 'mouseout', 'onOutTr');

        Polymer.dom(this.$$('tbody')).appendChild(trLocal);
      });
    }
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
    const pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

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
            if (selectedRow !== undefined
              && this.selectedRows.indexOf(selectedRow) !== -1) {
              paperCheckbox.checked = true;
            }
          }

          Polymer.dom(tdSelectable).appendChild(paperCheckbox);
          Polymer.dom(pgTr).appendChild(tdSelectable);
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

        const template = paperDatatableApiColumn.fillTemplate(
          valueFromRowData,
          otherPropertiesValue
        );

        if (paperDatatableApiColumn.hideable && paperDatatableApiColumn.hidden) {
          tdLocal.style.display = 'none';
        }

        Polymer.dom(tdLocal).appendChild(template.root);
        Polymer.dom(pgTr).appendChild(tdLocal);
      });
    });
  }

  _selectAllCheckbox(event) {
    const localTarget = Polymer.dom(event).localTarget;
    const allPaperCheckbox = Polymer.dom(this.root)
      .querySelectorAll('tbody tr td paper-checkbox');
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
    const table = this.$$('table:not(#frozenHeaderTable)');
    const allTr = table.querySelectorAll('tbody tr');
    allTr.forEach((tr) => {
      const selectedRow = this._findSelectableElement(tr.rowData);

      if (selectedRow === value) {
        const checkbox = tr.querySelector('paper-checkbox');
        if (checkbox) {
          checkbox.checked = true;

          let rowId = checkbox.rowIndex;
          if (this.selectableDataKey !== undefined
            && selectedRow !== undefined) {
            rowId = selectedRow;
          }
          this.push('selectedRows', rowId);
          tr.classList.add('selected');
        }
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
    if (localTarget.checked) {
      this.push('selectedRows', rowId);
      eventData = {
        selected: [rowId],
        data: rowData,
      };
      tr.classList.add('selected');
    } else {
      this.splice('selectedRows', this.selectedRows.indexOf(rowId), 1);
      eventData = {
        deselected: [rowId],
        data: rowData,
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

  _extractData(rowData, columnProperty) {
    if (columnProperty) {
      const splittedProperties = columnProperty.split('.');
      if (splittedProperties.length > 1) {
        return splittedProperties.reduce((prevRow, property) => {
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

  _setColumns() {
    let generateTr = false;

    if (this._columns.length > 0) {
      generateTr = true;
    }

    this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column')
      .map((columnParams, i) => {
        const column = columnParams;
        column.position = i;
        return column;
      });

    if (this.propertiesOrder.length === 0) {
      this._generatePropertiesOrder();
    }

    this.toggleColumns = this._columns.filter(column => column.hideable || column.draggableColumn);

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
      Polymer.dom(this.root).querySelectorAll(cssQuery).forEach((tdThParams) => {
        const tdTh = tdThParams;
        tdTh.style.display = isHidden ? 'table-cell' : 'none';
      });

      column.hidden = !isHidden;
      const toggleColumnIndex = this.toggleColumns.findIndex(
        toggleColumn => toggleColumn.property === columnProperty
      );

      this.set(`toggleColumns.${toggleColumnIndex}.hidden`, !isHidden);
    }
    this._resizeHeader();
  }

  _getThDisplayStyle(hidden) {
    if (hidden) {
      return 'none';
    }

    return 'table-cell';
  }

  _newSizeIsSelected() {
    const newSize = this.$$('paper-listbox').selected;
    if (newSize) {
      if (this.oldPage !== null && this.oldPage !== undefined) {
        this.page = 0;
      }
      this.size = newSize;
    }
  }

  _handleSort(event) {
    const column = event.detail.column;
    const paperDatatableApiThContent = event.currentTarget;
    const th = paperDatatableApiThContent.parentNode;
    const sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';

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
          direction: column.sortDirection,
        },
        column,
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
  deleteSortColumn(column, targetTh) {
    if (column.sortable && column.sorted) {
      let th = targetTh;

      if (!th) {
        th = Polymer.dom(this.root).querySelector(`thead th[property="${column.property}"]`);
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
    if (column.sortable) {
      let th = targetTh;
      const queryThContent = 'thead th paper-datatable-api-th-content[sortable][sorted]';
      Polymer.dom(this.root).querySelectorAll(queryThContent)
        .forEach((otherThContent) => {
          const thSorted = otherThContent.parentNode;

          if (thSorted.dataColumn !== column) {
            otherThContent.setAttribute('sort-direction', 'asc');
            otherThContent.removeAttribute('sorted');
            thSorted.dataColumn.set('sortDirection', undefined);
            thSorted.dataColumn.set('sorted', false);
          }
        });

      if (!th) {
        th = Polymer.dom(this.root).querySelector(`thead th[property="${column.property}"]`);
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

  _handleVaadinDatePickerLight(event) {
    const column = event.detail.column;
    const value = event.detail.value;

    this.async(() => {
      this._launchFilterEvent(value, column);
    });
  }

  _toggleFilter(column) {
    Polymer.dom.flush();
    const columnIndex = this._columns.findIndex(_column => _column.property === column.property);

    if (column.activeFilter) {
      this.set(`_columns.${columnIndex}.activeFilter`, false);
    } else {
      this.set(`_columns.${columnIndex}.activeFilter`, true);
    }
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
      this.set(`_columns.${columnIndex}.activeFilter`, true);
      this.fire('filter', {
        filter: {
          property: column.property,
          value,
        },
        column,
      });
      this._resizeHeader();
      this.async(() => {
        if (value) {
          this.set(`_columns.${columnIndex}.activeFilterValue`, value);
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
      this._resizeHeader();
      this.async(() => {
        if (value) {
          const columnIndex = this._columns.findIndex(
            _column => _column.property === column.property
          );
          this.set(`_columns.${columnIndex}.activeFilterValue`, value);
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

    if (column.activeFilter) {
      this._launchFilterEvent('', column);
    }
    this._toggleFilter(column);
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
      const footerDiv = Polymer.dom(this.root).querySelector('tfoot > tr > td > div > div');

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
    const allTh = Polymer.dom(this.root).querySelectorAll('thead th');
    allTh.forEach((th) => {
      th.addEventListener('dragover', this._dragOverHandle.bind(this), false);
      th.addEventListener('dragenter', this._dragEnterHandle.bind(this), false);
      th.addEventListener('drop', this._dropHandle.bind(this), false);
    });
    const allThDiv = Polymer.dom(this.root).querySelectorAll('thead th paper-datatable-api-th-content');
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
        const allTh = Polymer.dom(this.root).querySelectorAll('thead th');
        const toIndex = allTh.findIndex(th => th.getAttribute('property') === toProperty);
        const fromIndex = allTh.findIndex(th => th.getAttribute('property') === fromProperty);
        this._insertElement(allTh, toIndex, fromIndex);

        const allTr = Polymer.dom(this.root).querySelectorAll('tbody tr');
        allTr.forEach((tr) => {
          const allTd = Polymer.dom(tr).querySelectorAll('td');
          this._insertElement(allTd, toIndex, fromIndex);
        });

        this._resizeHeader();
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
    const allTh = Polymer.dom(this.root).querySelectorAll('thead th');
    const propertiesOrder = allTh.filter(th => th.getAttribute('property') !== null)
      .map(th => th.getAttribute('property'));

    this.propertiesOrder = propertiesOrder;
    this.async(() => this._changeColumn(propertiesOrder, () =>
      this.fire('order-column-change', { propertiesOrder })
    ), 100);
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
          this._resizeHeader();
          this.async(() => {
            this._handleDragAndDrop();
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
    if (this.frozenHeader) {
      Polymer.dom(this.root).querySelector('#wrapper').scrollTop = 0;
    } else {
      Polymer.dom(this.root).querySelector('tbody').scrollTop = 0;
    }
  }
}

Polymer(DtPaperDatatableApi);
