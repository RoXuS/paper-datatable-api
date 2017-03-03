class DtPaperDatatableApiThContent {

  beforeRegister() {
    this.is = 'paper-datatable-api-th-content';
    this.properties = {
      column: {
        type: Object,
        notify: true,
        value: () => ({}),
      },
      positionSortIcon: String,
      sortable: {
        type: Boolean,
        value: () => false,
      },
      sorted: {
        type: Boolean,
        value: () => false,
      },
      sortDirection: {
        type: String,
        value: () => 'asc',
      },
      previousValue: {
        type: String,
        value: () => '',
      },
      currentValue: {
        type: String,
        value: () => '',
      },
      localeDatePicker: {
        type: Object,
      },
      timeoutFilter: Number,
      focused: {
        type: Boolean,
        value: false,
      },
    };
  }

  get behaviors() {
    return [
      Polymer.AppLocalizeBehavior,
      Polymer.IronResizableBehavior,
    ];
  }

  _handleSort() {
    this.fire('sort-th-content', { column: this.column });
  }

  _handleFilter() {
    if (this.column.filter) {
      this.fire('filter-th-content', { column: this.column });
    }
  }

  setPaperInputValue(value) {
    if (this.column.date) {
      this.$$('vaadin-date-picker-light paper-input').value = value;
    }
    this.$$('paper-input').value = value;
  }

  _handleActiveFilterChange(event) {
    const parentDiv = event.currentTarget.parentNode;
    this.async(() => {
      let paperInput;
      if (!this.column.date) {
        paperInput = this.$$('paper-input');
        if (paperInput) {
          paperInput.focus();
          if (this.column.activeFilterValue) {
            this.previousValue = this.column.activeFilterValue;
          }
        }
      } else {
        const datePicker = parentDiv.querySelector('vaadin-date-picker-light');
        if (datePicker) {
          if (this.column.activeFilterValue) {
            this.previousValue = this.column.activeFilterValue;
          }
          datePicker.i18n = this.localeDatePicker;
        }
      }
    });
  }

  _handleKeyDownInput(event) {
    const input = event.currentTarget;
    this.currentValue = input.value;
    if (this.previousValue !== this.currentValue) {
      if (event.keyCode === 13) {
        this.fire('input-change-th-content', { column: this.column, value: this.currentValue });
        this.previousValue = this.currentValue;
      } else {
        clearTimeout(this.timeoutFilter);
        this.timeoutFilter = setTimeout(() => {
          if (this.previousValue !== this.currentValue) {
            this.fire('input-change-th-content', { column: this.column, value: this.currentValue });
          }
          this.previousValue = this.currentValue;
        }, 1000);
      }
    }
  }

  _handleVaadinDatePickerLight() {
    if (this.previousValue !== this.column.activeFilterValue && this.column.activeFilterValue) {
      this.fire('date-input-change-th-content', { column: this.column, value: this.column.activeFilterValue });
    }
  }

  equals(targetedValue, value) {
    return value === targetedValue;
  }

  _draggableClass(draggable) {
    if (draggable) {
      return 'draggable';
    }
    return '';
  }

  _isDraggable(draggableColumn, focused) {
    if (draggableColumn && !focused) {
      return 'true';
    }
    return 'false';
  }

}

Polymer(DtPaperDatatableApiThContent);
