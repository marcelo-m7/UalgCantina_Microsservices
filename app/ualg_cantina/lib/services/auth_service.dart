import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:universal_html/html.dart' as html;
import '../models/user_model.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  UserModel? currentUser;
  List<Map<String, dynamic>> cachedMenu = [];

  final apiBase = 'http://localhost:8000';

  Future<bool> startLoginFlow() async {
    // Abre a nova aba para login via backend
    final redirect = 'http://localhost:5000/token';
    html.window.open('$apiBase/login?redirect=$redirect', '_self');

    // NOTA: Aqui, espera-se que o frontend capture o token via callback
    return false;
  }

  Future<void> completeLogin(String token) async {
    final meRes = await http.get(
      Uri.parse('$apiBase/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (meRes.statusCode == 200) {
      final data = jsonDecode(meRes.body);
      currentUser = UserModel(email: data['email'], role: data['role']);

      final menuRes = await http.get(Uri.parse('$apiBase/week'));
      cachedMenu = List<Map<String, dynamic>>.from(jsonDecode(menuRes.body));
    } else {
      throw Exception('Token inválido');
    }
  }
}
