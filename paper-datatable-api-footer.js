class DtPaperDatatableApiFooter
  extends Polymer.mixinBehaviors([Polymer.AppLocalizeBehavior], Polymer.Element) {
  static get is() {
    return 'paper-datatable-api-footer';
  }

  static get properties() {
    return {
      footerPosition: String,
      size: {
        type: Number,
        notify: true,
      },
      page: {
        type: Number,
        notify: true,
      },
      availableSize: Array,
    };
  }

  _computeCurrentSize(page, size) {
    return page * size + 1;
  }

  _computeCurrentMaxSize(page, size, totalElements) {
    const maxSize = size * (page + 1);
    return maxSize > totalElements ? totalElements : maxSize;
  }

  _nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page = this.page + 1;
    }
  }

  _prevPage() {
    if (this.page > 0) {
      this.page = this.page - 1;
    }
  }

  _nextButtonEnabled(page, totalPages) {
    return page + 1 < totalPages;
  }

  _prevButtonEnabled(page) {
    return page > 0;
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

  _computePosition(position) {
    if (position === 'right') {
      return 'end-justified';
    }
    return '';
  }
}

customElements.define(DtPaperDatatableApiFooter.is, DtPaperDatatableApiFooter);
