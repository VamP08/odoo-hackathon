
class Item {
  constructor({ id, uploaderId, title, description, images, category, size, condition, tags, approved, status, pointValue }) {
    this.id = id;
    this.uploaderId = uploaderId;
    this.title = title;
    this.description = description;
    this.images = images;
    this.category = category;
    this.size = size;
    this.condition = condition;
    this.tags = tags;
    this.approved = approved;
    this.status = status; // available, swapped, pending
    this.pointValue = pointValue;
  }
}
export default Item;
