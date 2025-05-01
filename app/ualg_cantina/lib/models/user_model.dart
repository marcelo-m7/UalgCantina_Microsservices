// models/user.dart
class AppUser {
  final String email;
  final String role;

  AppUser({required this.email, required this.role});

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      email: json['email'],
      role: json['role'],
    );
  }
}
