import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../widgets/prato_card.dart';

class MenuPage extends StatefulWidget {
  final String token;

  const MenuPage({required this.token, super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  List<Map<String, dynamic>> ementa = [];

  @override
  void initState() {
    super.initState();
    _loadEmenta();
  }

  Future<void> _loadEmenta() async {
    final pratos = await AuthService.fetchEmenta();
    setState(() {
      ementa = pratos;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ementa Semanal')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: ementa.map((item) => PratoCard(item: item)).toList(),
      ),
    );
  }
}
