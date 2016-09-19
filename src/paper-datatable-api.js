class DtPaperDatatableApi {

  beforeRegister() {
    this.is = 'paper-datatable-api';
    this.properties = {
      /**
       * The columns element.
       */
      _columns: {
        type: Array,
        value: [],
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
        value: [],
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
      resources: {
        value() {
          return {
            en: {
              rowPerPage: 'Row per page',
              of: 'of',
            },
            'en-en': {
              rowPerPage: 'Row per page',
              of: 'of',
            },
            'en-US': {
              rowPerPage: 'Row per page',
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
      timeoutFilter: Number,
    };
  }

  static get behaviors() {
    return [
      Polymer.AppLocalizeBehavior,
    ];
  }

  attached() {
    this._setColumns();
    const userLang = navigator.language || navigator.userLanguage;
    this.language = userLang;
  }

  static equals(targetedValue, value) {
    return value === targetedValue;
  }

  static _generateClass(filters, paginate) {
    if (filters && paginate) {
      return 'paginate filters';
    } else if (filters) {
      return 'filters';
    }

    return 'paginate';
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

  static _nextButtonEnabled(page, totalPages) {
    return (page + 1) < totalPages;
  }

  static _prevButtonEnabled(page) {
    return page > 0;
  }

  static _computeCurrentSize(page, size) {
    return (page * size) + 1;
  }

  _computeCurrentMaxSize(page, size) {
    const maxSize = size * (page + 1);
    return (maxSize > this.totalElements ? this.totalElements : maxSize);
  }

  _dataChanged(data) {
    this._removeRows();
    this._fillRows(data);
    this._fillColumns();
  }

  _removeRows() {
    const pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');
    pgTrs.forEach(pgTr => Polymer.dom(this.$$('tbody')).removeChild(pgTr));
  }

  _fillRows(data) {
    data.forEach((rowData) => {
      const trLocal = document.createElement('tr');
      trLocal.rowData = rowData;
      trLocal.className = 'paper-datatable-api-tr';

      Polymer.dom(this.$$('tbody')).appendChild(trLocal);
    });
  }

  _fillColumns() {
    const pgTrs = Polymer.dom(this.root).querySelectorAll('.paper-datatable-api-tr');

    pgTrs.forEach((pgTr, i) => {
      const rowData = pgTr.rowData;

      if (this.selectable) {
        const tdSelectable = document.createElement('td');
        tdSelectable.className = 'selectable';
        const paperCheckbox = document.createElement('paper-checkbox');
        this.listen(paperCheckbox, 'change', '_selectChange');
        paperCheckbox.rowData = rowData;
        paperCheckbox.rowIndex = i;

        if (this.selectableDataKey !== undefined &&
          rowData[this.selectableDataKey] !== undefined &&
          this.selectedRows.indexOf(rowData[this.selectableDataKey]) !== -1) {
          paperCheckbox.checked = true;
        }

        Polymer.dom(tdSelectable).appendChild(paperCheckbox);
        Polymer.dom(pgTr).appendChild(tdSelectable);
        Polymer.dom.flush();
      }

      this._columns.forEach((paperDatatableApiColumn) => {
        const valueFromRowData = this._extractData(rowData, paperDatatableApiColumn.property);

        let isHidden = false;

        if (this.toggleColumns[paperDatatableApiColumn.position] &&
          !this.toggleColumns[paperDatatableApiColumn.position].show) {
          isHidden = true;
        }

        const otherPropertiesValue = {};
        paperDatatableApiColumn.otherProperties.forEach((property) => {
          otherPropertiesValue[property] = this._extractData(rowData, property);
        });

        const tdLocal = document.createElement('td');
        const template = paperDatatableApiColumn.fillTemplate(
          valueFromRowData,
          otherPropertiesValue
        );

        if (isHidden) {
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
        paperCheckbox.checked = true;
      } else {
        paperCheckbox.checked = false;
      }

      this._selectChange(paperCheckbox);
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
    if (this.selectableDataKey !== undefined && rowData[this.selectableDataKey] !== undefined) {
      rowId = rowData[this.selectableDataKey];
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

  static _extractData(rowData, columnProperty) {
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
    this._columns = this.queryAllEffectiveChildren('paper-datatable-api-column')
      .map((columnParams, i) => {
        const column = columnParams;
        column.position = i;
        return column;
      });

    this.toggleColumns = this._columns.filter(column => column.hideable);

    this._columnsHeight = this.selectable ? this._columns.length + 1 : this._columns.length;
  }

  /**
   * Hide or show a column following the number in argument.
   *
   * @property toggleColumn
   * @param {Number} columnPosition The number of column which will be toggled.
   */
  toggleColumn(columnPosition) {
    const column = this._columns[columnPosition];
    if (column && column.hideable) {
      const isShow = column.show;
      const indexColumn = this.selectable ? columnPosition + 2 : columnPosition + 1;
      const cssQuery = `tr th:nth-of-type(${indexColumn}), tr td:nth-of-type(${indexColumn})`;
      Polymer.dom(this.root).querySelectorAll(cssQuery).forEach((tdThParams) => {
        const tdTh = tdThParams;
        const displayMode = isShow ? 'none' : 'table-cell';
        tdTh.style.display = displayMode;
      });

      column.show = !isShow;
      const toggleColumnIndex = this.toggleColumns.findIndex(
        toggleColumn => toggleColumn.position === columnPosition
      );

      this.set(`toggleColumns.${toggleColumnIndex}.show`, !isShow);
    }
  }

  _newSizeIsSelected() {
    const newSize = this.$$('paper-listbox').selected;
    if (newSize) {
      this.page = 0;
      this.size = newSize;
    }
  }

  _handleSort(event) {
    const column = event.model.column;
    const paperIconButton = event.currentTarget;
    const th = paperIconButton.parentNode.parentNode;

    const queryPaperIconButton = 'thead th[sortable][sorted] paper-icon-button.sort';
    Polymer.dom(this.root).querySelectorAll(queryPaperIconButton)
      .forEach((otherPaperIconButton) => {
        const thSorted = otherPaperIconButton.parentNode.parentNode;

        if (thSorted.dataColumn !== column) {
          thSorted.removeAttribute('sort-direction');
          thSorted.removeAttribute('sorted');
          thSorted.dataColumn.set('sortDirection', undefined);
          thSorted.dataColumn.set('sorted', true);
        }
      });

    if (column.sortable) {
      const sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
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
          direction: column.sortDirection,
        },
        column,
      });
    }
  }

  _handleActiveFilterChange(event) {
    const parentDiv = event.currentTarget.parentNode;
    this.async(() => {
      let paperInput = parentDiv.querySelector(':scope > paper-input');
      if (paperInput) {
        paperInput.focus();
      } else {
        const datePicker = parentDiv.querySelector('vaadin-date-picker-light');
        if (datePicker) {
          paperInput = datePicker.querySelector('paper-input');
          datePicker.i18n = this.localeDatePicker;
        }
      }
    });
  }

  _handlePaperInputChange(event) {
    const column = event.model.column;
    const input = event.currentTarget;

    this.async(() => {
      if (input.value !== '') {
        this._launchFilterEvent(input, column);
      } else if (!input.focused) {
        this._toggleFilter(column);
      }
    });
  }

  static _handleTapClear(event) {
    const input = event.currentTarget.parentNode.parentNode.parentNode;
    input.value = '';
  }

  _handleVaadinDatePickerLight(event) {
    const column = event.model.column;
    const input = event.currentTarget;

    this.async(() => {
      if (input.value !== '') {
        this._launchFilterEvent(input, column);
      }
    });
  }

  _toggleFilter(column) {
    const columnIndex = this._columns.findIndex(_column => _column.property === column.property);

    if (column.activeFilter) {
      this.set(`_columns.${columnIndex}.activeFilter`, false);
    } else {
      this.set(`_columns.${columnIndex}.activeFilter`, true);
    }
  }

  _launchFilterEvent(input, column) {
    /**
     * Fired when a filters inputs changed.
     * @event filter
     * Event param: {{node: Object}} detail Contains sort object.
     * { filter: { property: STRING, value: STRING }, column: OBJECT }
     */
    this.fire('filter', {
      filter: {
        property: column.property,
        value: input.value,
      },
      column,
    });
  }

  _handleFilter(event) {
    const paperIconButton = event.currentTarget;
    const column = event.model.column;

    if (column.activeFilter) {
      const input = paperIconButton.parentNode.querySelector('paper-input');
      input.value = '';
      this._launchFilterEvent(input, column);
    }
    this._toggleFilter(column);
  }

  _handleKeyDownInput(event) {
    const column = event.model.column;
    const input = event.currentTarget;
    if (input.previousValue !== input.value) {
      if (event.keyCode === 13) {
        this._launchFilterEvent(input, column);
        input.previousValue = input.value;
      } else {
        clearTimeout(this.timeoutFilter);
        this.timeoutFilter = setTimeout(() => {
          if (input.previousValue !== input.value) {
            this._launchFilterEvent(input, column);
          }
          input.previousValue = input.value;
        }, 1000);
      }
    }
  }
}

Polymer(DtPaperDatatableApi);
