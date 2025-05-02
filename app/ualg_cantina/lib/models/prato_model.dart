class Prato {
  final String data;
  final String designacao;

  Prato({required this.data, required this.designacao});

  factory Prato.fromJson(Map<String, dynamic> json) {
    return Prato(
      data: json['data'],
      designacao: json['prato'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data,
      'prato': designacao,
    };
  }
}
