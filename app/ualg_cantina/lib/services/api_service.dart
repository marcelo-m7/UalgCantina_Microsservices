import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../models/prato.dart';
import 'auth_service.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000';

  static Future<User?> getMe() async {
    final token = AuthService.getToken();
    if (token == null) return null;

    final response = await http.get(
      Uri.parse('\$baseUrl/me'),
      headers: {'Authorization': 'Bearer \$token'},
    );

    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    }
    return null;
  }

  static Future<List<Prato>> getEmenta() async {
    final response = await http.get(Uri.parse('\$baseUrl/week'));
    if (response.statusCode == 200) {
      final list = jsonDecode(response.body) as List;
      return list.map((e) => Prato.fromJson(e)).toList();
    }
    return [];
  }
}