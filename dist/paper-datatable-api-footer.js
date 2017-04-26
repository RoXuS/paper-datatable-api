'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DtPaperDatatableApiFooter = function () {
  function DtPaperDatatableApiFooter() {
    _classCallCheck(this, DtPaperDatatableApiFooter);
  }

  _createClass(DtPaperDatatableApiFooter, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'paper-datatable-api-footer';
      this.properties = {
        footerPosition: String,
        size: {
          type: Number,
          notify: true
        },
        page: {
          type: Number,
          notify: true
        }
      };
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
    key: 'behaviors',
    get: function get() {
      return [Polymer.AppLocalizeBehavior];
    }
  }]);

  return DtPaperDatatableApiFooter;
}();

Polymer(DtPaperDatatableApiFooter);