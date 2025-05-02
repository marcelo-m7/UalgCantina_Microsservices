import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/user_model.dart';
import '../widgets/prato_card.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late String token;
  UserModel? user;
  List<Map<String, dynamic>> ementa = [];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    token = ModalRoute.of(context)!.settings.arguments as String;
    _loadData();
  }

  Future<void> _loadData() async {
    final currentUser = await AuthService.getCurrentUser(token);
    final pratos = await AuthService.fetchEmenta();

    setState(() {
      user = currentUser;
      ementa = pratos;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (user == null) {
      return Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: Text('Bem-vindo, ${user!.role}')),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: ementa.map((item) => PratoCard(item: item)).toList(),
      ),
    );
  }
}
