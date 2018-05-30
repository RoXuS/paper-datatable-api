/* global customElements */
class DtPaperDatatableApiThContent extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  Polymer.Element
) {
  static get is() {
    return 'paper-datatable-api-th-content';
  }

  static get properties() {
    return {
      language: String,
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
      timeoutFilter: Number,
      focused: {
        type: Boolean,
        value: false,
      },
      _dateFrom: Number,
      _dateTo: Number,
      dateFormat: String,
    };
  }

  static get observers() {
    return ['_dateChanged(_dateTo)'];
  }

  _dateChanged() {
    if (this._dateFrom && this._dateTo) {
      this.column.activeFilterValue = {
        dateFrom: this._dateFrom,
        dateTo: this._dateTo,
      };
      this.fire('date-input-change-th-content', {
        column: this.column,
        value: this.column.activeFilterValue,
      });
    }
  }

  _displayPickerDate(dateFrom, dateTo) {
    if (dateFrom && dateTo) {
      return `${dateFrom} - ${dateTo}`;
    }
    return '';
  }

  _handleSort() {
    this.fire('sort-th-content', { column: this.column });
  }

  _handleFilter() {
    if (this.column.filter) {
      if (this.column.activeFilter) {
        const paperInput = this.shadowRoot.querySelector('paper-input');
        if (paperInput) {
          paperInput.value = '';
        }
        this.previousValue = null;
      }
      this.fire('filter-th-content', { column: this.column });
    }
  }

  setPaperInputValue(value) {
    this.shadowRoot.querySelector('paper-input').value = value;
  }

  _handleChoiceChanged() {
    this.fire('input-change-th-content', { column: this.column, value: this._selectedChoices });
  }

  _handleActiveFilterChange(event) {
    const parentDiv = event.currentTarget.parentNode;
    Polymer.dom.flush();
    Polymer.Async.microTask.run(() => {
      let paperInput;
      if (!this.column.date && !this.column.choices) {
        paperInput = parentDiv.querySelector('paper-input');
        if (paperInput) {
          paperInput.setAttribute('tabindex', 1);
          paperInput.focus();
          if (this.column.activeFilterValue) {
            this.previousValue = this.column.activeFilterValue;
          }
        }
      } else if (this.column.date) {
        const datePicker = parentDiv.querySelector('range-datepicker-input');
        if (datePicker) {
          if (this.column.activeFilterValue) {
            this.previousValue = this.column.activeFilterValue;
          }
        }
      } else {
        this._selectedChoices = [];
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

  _computeIconName(choice, selectedChoices) {
    if (selectedChoices.base.indexOf(choice) === -1) {
      return 'check-box-outline-blank';
    }
    return 'check-box';
  }
}

customElements.define(DtPaperDatatableApiThContent.is, DtPaperDatatableApiThContent);
