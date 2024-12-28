# RabbitMQ 安装指南

## Linux 安装

1. 更新软件包列表：

   ```bash
   sudo apt-get update
   ```

2. 安装 RabbitMQ 的依赖 Erlang：

   ```bash
   sudo apt-get install -y erlang
   ```

3. 添加 RabbitMQ 的 APT 仓库：

   ```bash
   echo "deb https://dl.bintray.com/rabbitmq/debian bionic main" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list
   ```

4. 安装 RabbitMQ：

   ```bash
   sudo apt-get install -y rabbitmq-server
   ```

5. 启动 RabbitMQ 服务：

   ```bash
   sudo systemctl start rabbitmq-server
   ```

6. 确保 RabbitMQ 在系统启动时自动启动：

   ```bash
   sudo systemctl enable rabbitmq-server
   ```

## Windows 安装

1. 下载 RabbitMQ 安装程序：[RabbitMQ 下载页面](https://www.rabbitmq.com/download.html)

2. 双击安装程序并按照提示完成安装。

3. 安装完成后，打开命令提示符，启动 RabbitMQ 服务：

   ```cmd
   rabbitmq-service.bat start
   ```

## MacOS 安装

1. 使用 Homebrew 安装 RabbitMQ：

   ```bash
   brew update
   brew install rabbitmq
   ```

2. 启动 RabbitMQ 服务：

   ```bash
   brew services start rabbitmq
   ```

## Docker 安装

1. 拉取 RabbitMQ 的 Docker 镜像：

   ```bash
   docker pull rabbitmq
   ```

2. 运行 RabbitMQ 容器：

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq
   ```

3. 访问 RabbitMQ 管理界面：[http://localhost:15672](http://localhost:15672)
