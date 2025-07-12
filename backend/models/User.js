class User {
  constructor({ id, email, name, points, role, avatar, joinedDate }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.points = points;
    this.role = role;
    this.avatar = avatar;
    this.joinedDate = joinedDate;
  }
}
export default User;