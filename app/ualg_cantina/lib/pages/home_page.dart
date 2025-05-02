import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/user_model.dart';
import '../routes/app_routes.dart';
import '../widgets/custom_button.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late String token;
  UserModel? user;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    token = ModalRoute.of(context)!.settings.arguments as String;
    _loadUser();
  }

  Future<void> _loadUser() async {
    final currentUser = await AuthService.getCurrentUser(token);
    setState(() {
      user = currentUser;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: Text('Bem-vindo, ${user!.role}')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Olá, ${user!.email}', style: TextStyle(fontSize: 18)),
            const SizedBox(height: 20),
            CustomButton(
              text: 'Ver Ementa',
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.menu,
                  arguments: token,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
