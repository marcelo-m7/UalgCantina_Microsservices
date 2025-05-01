import 'dart:html';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  final uri = Uri.base;
  final token = uri.queryParameters['token'];

  if (token != null) {
    window.localStorage['jwt'] = token;
  }

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final String apiUrl = 'http://localhost:8000';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cantina UAlg',
      home: HomePage(apiUrl: apiUrl),
    );
  }
}

class HomePage extends StatefulWidget {
  final String apiUrl;
  HomePage({required this.apiUrl});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? jwt;
  Map<String, dynamic>? userInfo;
  List<Map<String, dynamic>> ementa = [];

  @override
  void initState() {
    super.initState();
    jwt = window.localStorage['jwt'];
    if (jwt != null) {
      fetchUserInfo();
      fetchEmenta();
    }
  }

  Future<void> fetchUserInfo() async {
    final response = await http.get(
      Uri.parse('${widget.apiUrl}/me'),
      headers: {'Authorization': 'Bearer $jwt'},
    );
    if (response.statusCode == 200) {
      setState(() {
        userInfo = jsonDecode(response.body);
      });
    }
  }

  Future<void> fetchEmenta() async {
    final response = await http.get(Uri.parse('${widget.apiUrl}/week'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        ementa = List<Map<String, dynamic>>.from(data);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (jwt == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Cantina UAlg')),
        body: Center(
          child: ElevatedButton(
            onPressed: () {
              // Redireciona para login
              window.location.href =
                  '${widget.apiUrl}/login?redirect=${Uri.encodeComponent(window.location.origin + '/')}';
            },
            child: Text('Login com Google'),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('Bem-vindo à Cantina')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (userInfo != null)
              Text("Logado como: ${userInfo!['email']} (${userInfo!['role']})"),
            SizedBox(height: 20),
            Text('Ementa Semanal:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            ...ementa.map((e) => Text("${e['data']} - ${e['prato']}")),
          ],
        ),
      ),
    );
  }
}
