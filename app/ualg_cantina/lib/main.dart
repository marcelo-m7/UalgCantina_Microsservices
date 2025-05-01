import 'dart:html';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

const apiBaseUrl = 'http://localhost:8000';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cantina UAlg',
      home: TokenHandler(),
    );
  }
}

class TokenHandler extends StatefulWidget {
  @override
  State<TokenHandler> createState() => _TokenHandlerState();
}

class _TokenHandlerState extends State<TokenHandler> {
  String? token;
  String? role;
  List<Map<String, dynamic>> ementa = [];

  @override
  void initState() {
    super.initState();

    // Extrai token da URL se presente (ex: /token?token=xxx)
    final uri = Uri.base;
    final tokenFromUrl = uri.queryParameters['token'];
    if (tokenFromUrl != null) {
      window.history.pushState(null, 'UAlg Cantina', '/'); // limpa URL
      setState(() {
        token = tokenFromUrl;
      });
      fetchUserRole();
      fetchEmenta();
    }
  }

  void login() {
    final loginUrl = '$apiBaseUrl/login?redirect=http://localhost:5000/token';
    window.location.href = loginUrl;
  }

  Future<void> fetchUserRole() async {
    final response = await http.get(
      Uri.parse('$apiBaseUrl/me'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        role = data['role'];
      });
    }
  }

  Future<void> fetchEmenta() async {
    final response = await http.get(
      Uri.parse('$apiBaseUrl/week'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        ementa = List<Map<String, dynamic>>.from(data);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (token == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Cantina UAlg')),
        body: Center(
          child: ElevatedButton(
            onPressed: login,
            child: Text('Login com Google'),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('Cantina UAlg')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Logado como: $role'),
            SizedBox(height: 20),
            ...ementa.map(
              (item) => Text('${item['data']} - ${item['prato']}'),
            ),
          ],
        ),
      ),
    );
  }
}
