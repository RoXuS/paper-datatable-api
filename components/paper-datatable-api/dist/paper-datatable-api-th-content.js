'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DtPaperDatatableApiThContent = function () {
  function DtPaperDatatableApiThContent() {
    _classCallCheck(this, DtPaperDatatableApiThContent);
  }

  _createClass(DtPaperDatatableApiThContent, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'paper-datatable-api-th-content';
      this.properties = {
        column: {
          type: Object,
          notify: true,
          value: function value() {
            return {};
          }
        },
        positionSortIcon: String,
        sortable: {
          type: Boolean,
          value: function value() {
            return false;
          }
        },
        sorted: {
          type: Boolean,
          value: function value() {
            return false;
          }
        },
        sortDirection: {
          type: String,
          value: function value() {
            return 'asc';
          }
        },
        previousValue: {
          type: String,
          value: function value() {
            return '';
          }
        },
        currentValue: {
          type: String,
          value: function value() {
            return '';
          }
        },
        localeDatePicker: {
          type: Object
        },
        timeoutFilter: Number,
        focused: {
          type: Boolean,
          value: false
        }
      };
    }
  }, {
    key: '_handleSort',
    value: function _handleSort() {
      this.fire('sort-th-content', { column: this.column });
    }
  }, {
    key: '_handleFilter',
    value: function _handleFilter() {
      if (this.column.filter) {
        if (this.column.activeFilter) {
          var paperInput = this.$$('paper-input');
          if (paperInput) {
            paperInput.value = '';
          }
          this.previousValue = null;
        }
        this.fire('filter-th-content', { column: this.column });
      }
    }
  }, {
    key: 'setPaperInputValue',
    value: function setPaperInputValue(value) {
      if (this.column.date) {
        this.$$('vaadin-date-picker-light paper-input').value = value;
      }
      this.$$('paper-input').value = value;
    }
  }, {
    key: '_handleChoiceChanged',
    value: function _handleChoiceChanged() {
      this.fire('input-change-th-content', { column: this.column, value: this._selectedChoices });
    }
  }, {
    key: '_handleActiveFilterChange',
    value: function _handleActiveFilterChange(event) {
      var _this = this;

      var parentDiv = event.currentTarget.parentNode;
      this.async(function () {
        var paperInput = void 0;
        if (!_this.column.date && !_this.column.choices) {
          paperInput = _this.$$('paper-input');
          if (paperInput) {
            paperInput.focus();
            if (_this.column.activeFilterValue) {
              _this.previousValue = _this.column.activeFilterValue;
            }
          }
        } else if (_this.column.date) {
          var datePicker = parentDiv.querySelector('vaadin-date-picker-light');
          if (datePicker) {
            if (_this.column.activeFilterValue) {
              _this.previousValue = _this.column.activeFilterValue;
            }
            datePicker.i18n = _this.localeDatePicker;
          }
        } else {
          _this._selectedChoices = [];
        }
      });
    }
  }, {
    key: '_handleKeyDownInput',
    value: function _handleKeyDownInput(event) {
      var _this2 = this;

      var input = event.currentTarget;
      this.currentValue = input.value;
      if (this.previousValue !== this.currentValue) {
        if (event.keyCode === 13) {
          this.fire('input-change-th-content', { column: this.column, value: this.currentValue });
          this.previousValue = this.currentValue;
        } else {
          clearTimeout(this.timeoutFilter);
          this.timeoutFilter = setTimeout(function () {
            if (_this2.previousValue !== _this2.currentValue) {
              _this2.fire('input-change-th-content', { column: _this2.column, value: _this2.currentValue });
            }
            _this2.previousValue = _this2.currentValue;
          }, 1000);
        }
      }
    }
  }, {
    key: '_handleVaadinDatePickerLight',
    value: function _handleVaadinDatePickerLight() {
      if (this.previousValue !== this.column.activeFilterValue && this.column.activeFilterValue) {
        this.fire('date-input-change-th-content', { column: this.column, value: this.column.activeFilterValue });
      }
    }
  }, {
    key: 'equals',
    value: function equals(targetedValue, value) {
      return value === targetedValue;
    }
  }, {
    key: '_draggableClass',
    value: function _draggableClass(draggable) {
      if (draggable) {
        return 'draggable';
      }
      return '';
    }
  }, {
    key: '_isDraggable',
    value: function _isDraggable(draggableColumn, focused) {
      if (draggableColumn && !focused) {
        return 'true';
      }
      return 'false';
    }
  }, {
    key: '_computeIconName',
    value: function _computeIconName(choice, selectedChoices) {
      if (selectedChoices.base.indexOf(choice) === -1) {
        return 'check-box-outline-blank';
      }
      return 'check-box';
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior, Polymer.IronResizableBehavior];
    }
  }]);

  return DtPaperDatatableApiThContent;
}();

Polymer(DtPaperDatatableApiThContent);