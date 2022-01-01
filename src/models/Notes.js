class Notes {
  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.body = props.body;
    this.tags = props.tags;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

module.exports = Notes;
