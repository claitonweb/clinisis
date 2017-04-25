var menus = {
	"Atendimentos": {
		"Consulta": {
			state: 'atendimentos-consulta-lista'
		},
		"Compras": {
			state: 'atendimentos-compra-lista'
		},
		"Compras Externas": {
			state: 'atendimentos-compra-externa-lista'
		},
		"Consultas Externas": {
			state: 'atendimentos-consulta-externa-lista'
		},
		"Cupons": {
			state: 'atendimentos-cupom-lista'
		}
		
	},
	"Campanhas": {
		"Cupons": {
			state: 'atendimentos-cupom-lista'
		}
		
	},
	"Cadastros": {
		"Clientes": {
			state: 'cadastros-cliente-lista'
		},
		"Médicos": {
			state: 'cadastros-medico-lista'
		},
		"Fornecedores": {
			state: 'cadastros-fornecedor-lista'
		},
		"Vacinas": {
			state: 'estoque-vacina-lista'
		},
		"Pacotes Vacinais": {
			state: 'estoque-pacotevacinal-lista'
		}
	},
	"Estoque": {
		"Entradas": {
			state: 'estoque-lancamento-lista'
		},
		"Saídas": {
			state: 'estoque-saidas-lista'
		},
		"Inventário": {
			state: 'estoque-inventario'
		}
	},
	"Financeiro": {
		"Vendas": {
			state: 'financeiro-vendas'
		},
		"Fluxo de Caixa": {
			state: 'financeiro-caixa-lista'
		},
		"Centros de Custo": {
			state: 'financeiro-centrocusto-lista'
		},
		"Contas Contábeis": {
			state: 'financeiro-contacontabil-lista'
		},
		"Domicílios Bancários": {
			state: 'financeiro-domiciliobancario-lista'
		},
		"Contas a Pagar": {
			state: 'financeiro-contaapagar-lista'
		},
		"Lançamentos Pagamento": {
			state: 'financeiro-lancamentopagamento-lista'
		},
		"Previsão de Pagamentos": {
			state: 'financeiro-previsaoapagar-lista'
		},
		"Contas a Receber": {
			state: 'financeiro-contaareceber-lista'
		},
		"Lançamentos Recebimento": {
			state: 'financeiro-lancamentorecebimento-lista'
		},
		"Previsão de Recebimentos": {
			state: 'financeiro-previsaoareceber-lista'
		}
	},
	"Configurações Adm.": {
		"Especialidades Médicas": {
			state: 'admconfs-especialidade-lista'
		},
		"Periodicidades": {
			state: 'admconfs-periodicidade-lista'
		},
		"Agências": {
			state: 'admconfs-agencia-lista'
		},
		"Bancos": {
			state: 'admconfs-banco-lista'
		},
		"Situações Cadastro": {
			state: 'admconfs-situacaocadastro-lista'
		},
		"Feriados": {
			state: 'admconfs-feriado-lista'
		},
		"Formas de Pagamento": {
			state: 'admconfs-formaspagamento-lista'
		}
	},
	"Acesso": {
		"Perfis de Usuário": {
			state: 'acl-perfil-lista'
		},
		"Recursos": {
			state: 'acl-resource-lista'
		},
		"Usuários": {
			state: 'acl-usuario-lista'
		}
	}
};

var externo = false;
