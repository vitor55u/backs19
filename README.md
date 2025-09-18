# SecureCommerce API

API para catálogo de produtos da startup **SecureCommerce**, desenvolvida em Node.js + Express e banco de dados PostgreSQL.  
O projeto adota boas práticas de **segurança**, **otimização de performance** e **automação com CI/CD**.

---

## 🌐 Servidor e Otimização

### Escolha do Servidor Web
Optei pelo **Nginx** como servidor web, atuando como **reverse proxy** para a aplicação Node.js.  
Ele é amplamente utilizado em produção devido a sua **leveza, estabilidade e eficiência**.  
Suas principais funções no projeto são:
- Gerenciar conexões HTTPS (TLS).
- Encaminhar requisições para a aplicação Node.js.
- Habilitar compressão HTTP.
- Controlar cache e limitar requisições.

### Técnicas de Otimização

1. **Compressão HTTP (gzip/brotli)**  
   - Reduz o tamanho das respostas enviadas ao cliente.  
   - Acelera o carregamento, principalmente para respostas JSON grandes.  
   - Configurado tanto no Nginx quanto na aplicação Node.js via `compression()`.

2. **Cache de Respostas (Redis + Cache-Control)**  
   - Respostas de leitura, como listagem de produtos, podem ser armazenadas em cache.  
   - Diminui a carga no banco de dados e melhora a velocidade de resposta.  
   - No Nginx, headers `Cache-Control` podem ser configurados para recursos estáticos.  
   - Opcionalmente, Redis pode armazenar consultas SQL mais acessadas.

---

## 🔒 Segurança de Dados

### Estrutura de Banco de Dados
A tabela principal é `products`, que contém:
- `id` (chave primária, autoincremento)  
- `name` (nome do produto)  
- `price` (preço com validação para não permitir valores negativos)  
- `stock` (quantidade disponível)  
- `created_at` (data de criação)

### Plano de Proteção dos Dados
- **Controle de Acesso ao Banco:**  
  - Usuário de banco com privilégios mínimos (sem permissões de administração).  
  - Conexão obrigatória via TLS/SSL.  

- **Autenticação e Autorização na API:**  
  - Autenticação via tokens JWT.  
  - Diferentes níveis de acesso conforme permissões (admin, cliente, etc.).  

- **Criptografia:**  
  - **Em trânsito:** HTTPS obrigatório em todas as conexões.  
  - **Em repouso:** banco configurado com encryption-at-rest.  
  - **Senhas:** nunca armazenadas em texto puro — uso de algoritmos de hash (bcrypt/argon2).  
  - **Dados sensíveis (como tokens de pagamento):** tokenização e, se necessário, criptografia de campo com serviços como AWS KMS ou Azure Key Vault.  

- **Boas Práticas:**  
  - Queries parametrizadas para evitar SQL Injection.  
  - Logs sem informações sensíveis.  
  - Backups periódicos e rotação de segredos.  

---

## ⚙️ Pipeline de CI/CD

### Configuração no GitHub Actions
O pipeline está em `.github/workflows/main.yml`. Ele executa as seguintes etapas:

1. **Checkout do código** → Baixa o repositório para o runner.  
2. **Configuração do Node.js** → Define a versão Node (18).  
3. **Instalação de dependências** → `npm ci`.  
4. **Lint** → Verifica o padrão de código.  
5. **Testes** → Executa testes automatizados (mesmo que simples).  

### Importância da Automação
- **Confiabilidade:** garante que cada alteração enviada ao GitHub seja testada automaticamente.  
- **Qualidade:** falhas são detectadas antes de ir para produção.  
- **Agilidade:** elimina processos manuais repetitivos, acelerando o ciclo de deploy.  
- **Segurança:** impede que código vulnerável ou quebrado seja colocado em produção.  

---

## ▶️ Como rodar localmente

```bash
git clone https://github.com/seu-usuario/securecommerce.git
cd securecommerce
npm install
copy .env.example .env   # configure DATABASE_URL e JWT_SECRET
npm start
