# RabbitMQ 安装教程

本文介绍如何在 Linux、Windows、macOS 系统上安装 RabbitMQ，以及如何使用 Docker 快速部署 RabbitMQ。

## 安装前提

在安装 RabbitMQ 之前，确保系统中已安装 **Erlang/OTP**。RabbitMQ 是基于 Erlang 开发的，因此需要先安装 Erlang。RabbitMQ 和 Erlang 的版本兼容性请参考 [官方文档](https://www.rabbitmq.com/which-erlang.html)。

## Linux 安装

### 安装 Erlang

::: code-group

```bash [Ubuntu/Debian]
wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb
sudo dpkg -i erlang-solutions_2.0_all.deb
sudo apt-get update
sudo apt-get install -y erlang
```

```bash [CentOS/RHEL]
sudo yum install -y epel-release
sudo yum install -y erlang
```

:::

### 安装 RabbitMQ

::: code-group

```bash [Ubuntu/Debian]
echo "deb https://dl.bintray.com/rabbitmq/debian $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y rabbitmq-server
```

```bash [CentOS/RHEL]
sudo yum install -y https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.9.11/rabbitmq-server-3.9.11-1.el7.noarch.rpm
sudo yum install -y rabbitmq-server
```

:::

### 启动 RabbitMQ

```bash
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl status rabbitmq-server
```

### 启用管理插件

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

访问管理界面：`http://localhost:15672`，默认用户名：`guest`，默认密码：`guest`。

## Windows 安装

### 安装 Erlang

1. 下载 Erlang 安装包：[Erlang 官网](https://www.erlang.org/downloads)。
2. 运行安装包，按照提示完成安装。

### 安装 RabbitMQ

1. 下载 RabbitMQ 安装包：[RabbitMQ 官网](https://www.rabbitmq.com/install-windows.html)。
2. 运行安装包，按照提示完成安装。

### 启动 RabbitMQ

```bash
rabbitmq-service.bat start
```

### 启用管理插件

```bash
rabbitmq-plugins enable rabbitmq_management
```

访问管理界面：`http://localhost:15672`，默认用户名：`guest`，默认密码：`guest`。

## MacOS 安装

### 使用 Homebrew 安装

1. 安装 Homebrew（如果未安装）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安装 Erlang 和 RabbitMQ：

```bash
brew install erlang rabbitmq
```

### 启动 RabbitMQ

```bash
brew services start rabbitmq
```

### 启用管理插件

```bash
rabbitmq-plugins enable rabbitmq_management
```

访问管理界面：`http://localhost:15672`，默认用户名：`guest`，默认密码：`guest`。

## Docker 安装

### 安装 Docker

1. 下载并安装 Docker：[Docker 官网](https://www.docker.com/get-started)。
2. 启动 Docker 服务。

### 拉取 RabbitMQ 镜像

```bash
docker pull rabbitmq:3.9-management
```

### 运行 RabbitMQ 容器

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management
```

### 访问管理界面

- 默认地址：`http://localhost:15672`
- 默认用户名：`guest`
- 默认密码：`guest`

## 验证安装

1. 访问 RabbitMQ 管理界面：`http://localhost:15672`，使用默认用户名 `guest` 和密码 `guest` 登录。
2. 检查 RabbitMQ 服务状态：

   ```bash
   rabbitmqctl status
   ```

## 常见问题

1. **无法访问管理界面**：
   - 确保 RabbitMQ 服务已启动。
   - 检查防火墙设置，确保端口 `15672` 和 `5672` 已开放。

2. **Erlang 版本不兼容**：
   - 参考 [RabbitMQ 官方文档](https://www.rabbitmq.com/which-erlang.html)，确保安装的 Erlang 版本与 RabbitMQ 兼容。

3. **Docker 容器无法启动**：
   - 检查端口是否被占用，尝试更改端口映射（如 `-p 5673:5672`）。
