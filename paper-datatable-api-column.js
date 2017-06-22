/* global customElements */
class DtPaperDatatableApiColumn
  extends Polymer.mixinBehaviors([Polymer.Templatizer], Polymer.Element) {
  static get is() {
    return 'paper-datatable-api-column';
  }

  static get properties() {
    return {
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
        value: [],
      },
      /**
       * If true, the colum can be sort.
       */
      sortable: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, the column can be draggable.
       */
      draggableColumn: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, the column is hidden.
       */
      hidden: {
        type: Boolean,
        value: false,
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
        value: false,
      },
      /**
       * If true, the column can be filtered.
       */
      filter: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, a date picker is displayed when the column is sorted.
       */
      date: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, the column can be hidden.
       */
      hideable: {
        type: Boolean,
        value: false,
      },
      /**
       * Position of the column in the table.
       */
      position: Number,
      activeFilter: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, the column apply the --paper-datatable-api-custom-td mixin.
       */
      tdCustomStyle: {
        type: Boolean,
        value: false,
      },
      /**
       * If setted, the choices are displayed in place of the paper-input (in filter mode)
       */
      choices: Array,
    };
  }

  attached() {
    const props = {};
    props.__key__ = true;
    props[this.header] = true;
    props[this.property] = true;
    this._instanceProps = props;

    if (this.ctor) {
      return;
    }
    const template = this.queryEffectiveChildren('template');
    this.templatize(template);
  }

  /**
   * Stamp the value in template (according to property).
   *
   * @property fillTemplate
   * @param {String} value The value of the property.
   */
  fillTemplate(value, otherValues) {
    const instance = this.stamp({ value, otherValues });
    instance.value = value;
    instance.otherValues = otherValues;
    return instance;
  }
}

customElements.define(DtPaperDatatableApiColumn.is, DtPaperDatatableApiColumn);
