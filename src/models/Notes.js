class Notes {
  constructor(props) {
    this.id = props.id;
    this.title = props.title;
    this.body = props.body;
    this.tags = props.tags;
    this.createAt = props.created_at;
    this.updateAt = props.updated_at;
  }
}

module.exports = Notes;
