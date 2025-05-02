
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(Uri.parse('$baseUrl$endpoint'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erro na requisição: ${response.statusCode}');
    }
  }

  Future<dynamic> post(String endpoint, Map<String, String> body) async {
    final response = await http.post(Uri.parse('$baseUrl$endpoint'), body: body);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erro ao enviar dados: ${response.statusCode}');
    }
  }
}
