import 'package:flutter/material.dart';

class PratoCard extends StatelessWidget {
  final Map<String, dynamic> item;

  const PratoCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(item['prato']),
        subtitle: Text(item['data']),
      ),
    );
  }
}
