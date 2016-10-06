'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DtPaperDatatableApiColumn = function () {
  function DtPaperDatatableApiColumn() {
    _classCallCheck(this, DtPaperDatatableApiColumn);
  }

  _createClass(DtPaperDatatableApiColumn, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'paper-datatable-api-column';

      this.properties = {
        /**
         * The name of the header for this column.
         */
        header: String,
        /**
         * Property which will be available in data (throught paper-datatable-api).
         */
        property: String,
        /**
         * If set, these other properties will be available in data (throught paper-datatable-api).
         * Usefull to keep id of the object.
         */
        otherProperties: {
          type: Array,
          value: []
        },
        /**
         * If true, the colum can be sort.
         */
        sortable: {
          type: Boolean,
          value: false
        },
        /**
         * If true, the column is hidden.
         */
        hidden: {
          type: Boolean,
          value: false
        },
        /**
         * Current sort direction (asc or desc).
         */
        sortDirection: String,
        /**
         * If true, the column is currently sorted.
         */
        sorted: {
          type: Boolean,
          value: false
        },
        /**
         * If true, the column can be filtered.
         */
        filter: {
          type: Boolean,
          value: false
        },
        /**
         * If true, a date picker is displayed when the column is sorted.
         */
        date: {
          type: Boolean,
          value: false
        },
        /**
         * If true, the column can be hidden.
         */
        hideable: {
          type: Boolean,
          value: false
        },
        /**
         * Position of the column in the table.
         */
        position: Number,
        activeFilter: {
          type: Boolean,
          value: false
        },
        /**
         * If true, the column apply the --paper-datatable-api-custom-td mixin.
         */
        tdCustomStyle: {
          type: Boolean,
          value: false
        }
      };
    }
  }, {
    key: 'ready',
    value: function ready() {
      var props = {};
      props.__key__ = true;
      props[this.header] = true;
      props[this.property] = true;
      this._instanceProps = props;

      var template = Polymer.dom(this).querySelector('template');
      this.templatize(template);
    }

    /**
     * Stamp the value in template (according to property).
     *
     * @property fillTemplate
     * @param {String} value The value of the property.
     */

  }, {
    key: 'fillTemplate',
    value: function fillTemplate(value, otherValues) {
      var instance = this.stamp({ value: value, otherValues: otherValues });
      return instance;
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [Polymer.Templatizer];
    }
  }]);

  return DtPaperDatatableApiColumn;
}();

Polymer(DtPaperDatatableApiColumn);