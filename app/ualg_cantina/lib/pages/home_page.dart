import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class HomePage extends StatefulWidget {
  final String jwt;
  const HomePage({super.key, required this.jwt});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Map<String, dynamic>> pratos = [];

  Future<void> fetchEmenta() async {
    final response = await http.get(
      Uri.parse("http://localhost:8000/week"),
      headers: {"Authorization": "Bearer ${widget.jwt}"},
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        pratos = List<Map<String, dynamic>>.from(data);
      });
    } else {
      print("Erro ao buscar ementa: ${response.body}");
    }
  }

  @override
  void initState() {
    super.initState();
    fetchEmenta();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ementa da Cantina")),
      body: ListView.builder(
        itemCount: pratos.length,
        itemBuilder: (context, index) {
          final item = pratos[index];
          return ListTile(
            title: Text(item["prato"]),
            subtitle: Text(item["data"]),
          );
        },
      ),
    );
  }
}
