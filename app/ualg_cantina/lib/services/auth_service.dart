import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';

class AuthService {
  static const apiUrl = 'http://localhost:8000';

  static Future<String?> exchangeToken(String idToken) async {
    final response = await http.post(
      Uri.parse('$apiUrl/login'),
      body: {'id_token': idToken},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['access_token'];
    }
    return null;
  }

  static Future<UserModel?> getCurrentUser(String jwt) async {
    final response = await http.get(
      Uri.parse('$apiUrl/me'),
      headers: {'Authorization': 'Bearer $jwt'},
    );
    if (response.statusCode == 200) {
      return UserModel.fromJson(jsonDecode(response.body));
    }
    return null;
  }

  static Future<List<Map<String, dynamic>>> fetchEmenta() async {
    final response = await http.get(Uri.parse('$apiUrl/week'));
    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    }
    return [];
  }
}
