# Java 面向对象编程

## 简介

面向对象编程（Object-Oriented Programming，OOP）是 Java 语言的核心特性。OOP 将数据和行为封装成对象，通过对象之间的交互来构建和运行程序。

Java 作为一种纯面向对象编程语言，其所有代码都必须位于类中，所有数据和方法都必须与对象相关联。本文将详细介绍 Java 面向对象编程的基本概念、特性以及最佳实践。

## 基本概念

### 类与对象

#### 类（Class）

类是对象的蓝图或模板，定义了对象的属性和行为。类包含：

- **属性**：描述对象状态的变量，也称为字段或成员变量
- **方法**：描述对象行为的函数
- **构造方法**：用于创建和初始化对象的特殊方法

```java
public class Student {
    // 属性（成员变量）
    private String name;
    private int age;
    private String studentId;
    
    // 构造方法
    public Student(String name, int age, String studentId) {
        this.name = name;
        this.age = age;
        this.studentId = studentId;
    }
    
    // 普通方法
    public void study() {
        System.out.println(name + " is studying.");
    }
    
    // getter 和 setter 方法
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    // 其他 getter 和 setter 方法略
}
```

#### 对象（Object）

对象是类的实例，代表现实世界中的实体。创建对象的过程称为实例化。

```java
// 创建 Student 类的实例
Student student1 = new Student("张三", 20, "20210001");
Student student2 = new Student("李四", 19, "20210002");

// 调用对象的方法
student1.study();  // 输出：张三 is studying.
```

### 成员变量与局部变量

#### 成员变量

- 定义在类中，方法外
- 有默认初始值
- 作用域为整个类
- 可以使用访问修饰符控制访问权限

#### 局部变量

- 定义在方法、构造方法或代码块中
- 没有默认初始值，使用前必须初始化
- 作用域仅限于定义它的方法或代码块
- 不能使用访问修饰符

```java
public class VariableExample {
    private int memberVar = 10;  // 成员变量
    
    public void method() {
        int localVar = 20;  // 局部变量
        System.out.println(memberVar);  // 可以访问成员变量
        System.out.println(localVar);   // 可以访问局部变量
    }
    
    public void anotherMethod() {
        System.out.println(memberVar);  // 可以访问成员变量
        // System.out.println(localVar);  // 错误：无法访问局部变量
    }
}
```

## 面向对象的三大特性

### 封装（Encapsulation）

封装是将数据（属性）和行为（方法）包装在一个单元中，并对外部隐藏内部实现细节的机制。通过访问修饰符来实现封装。

#### 访问修饰符

- **private**：只能在类内部访问
- **默认（无修饰符）**：同一包内可访问
- **protected**：同一包内和子类可访问
- **public**：任何地方都可以访问

```java
public class Account {
    private double balance;  // 私有属性
    
    public void deposit(double amount) {  // 公共方法
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public void withdraw(double amount) {  // 公共方法
        if (amount > 0 && balance >= amount) {
            balance -= amount;
        }
    }
    
    public double getBalance() {  // getter 方法
        return balance;
    }
}
```

封装的优点：
- 保护数据不被外部直接访问和修改
- 提高代码的可维护性和灵活性
- 实现数据验证和约束

### 继承（Inheritance）

继承允许一个类（子类）继承另一个类（父类）的属性和方法，实现代码重用和层次结构。Java 只支持单继承，即一个类只能有一个直接父类。

```java
// 父类
public class Person {
    protected String name;
    protected int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("我是 " + name + "，今年 " + age + " 岁。");
    }
}

// 子类
public class Teacher extends Person {
    private String subject;
    
    public Teacher(String name, int age, String subject) {
        super(name, age);  // 调用父类构造方法
        this.subject = subject;
    }
    
    // 方法重写（Override）
    @Override
    public void introduce() {
        System.out.println("我是 " + name + "，今年 " + age + " 岁，是一名 " + subject + " 老师。");
    }
    
    // 子类特有方法
    public void teach() {
        System.out.println(name + " 正在教授 " + subject + " 课程。");
    }
}
```

继承的优点：
- 代码重用，减少冗余
- 建立类之间的层次关系
- 支持多态性

#### 方法重写（Override）

子类可以重写（覆盖）父类的方法，提供特定于子类的实现。重写方法必须：
- 具有与父类方法相同的名称、参数列表和返回类型
- 访问修饰符不能比父类方法更严格
- 不能抛出比父类方法更多的异常

### 多态（Polymorphism）

多态允许一个引用变量引用不同类型的对象，调用同一方法时表现出不同的行为。多态分为编译时多态（方法重载）和运行时多态（方法重写）。

#### 运行时多态

```java
public class PolymorphismExample {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Person person1 = new Person("王五", 30);
        Person person2 = new Teacher("赵六", 35, "数学");
        
        person1.introduce();  // 调用 Person 的 introduce 方法
        person2.introduce();  // 调用 Teacher 的 introduce 方法（多态）
        
        // 父类引用不能直接调用子类特有的方法
        // person2.teach();  // 编译错误
        
        // 需要类型转换才能调用子类特有方法
        if (person2 instanceof Teacher) {
            Teacher teacher = (Teacher) person2;
            teacher.teach();
        }
    }
}
```

#### 编译时多态（方法重载）

方法重载是在同一个类中定义多个名称相同但参数列表不同的方法。

```java
public class Calculator {
    // 方法重载
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

## 抽象类与接口

### 抽象类（Abstract Class）

抽象类是不能实例化的类，用于定义子类共同的属性和方法。抽象类可以包含抽象方法（没有实现的方法）和普通方法。

```java
public abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // 抽象方法，子类必须实现
    public abstract double calculateArea();
    
    // 普通方法
    public String getColor() {
        return color;
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

### 接口（Interface）

接口定义了一组抽象方法，由实现接口的类提供具体实现。接口实现了多继承的部分功能。

```java
public interface Drawable {
    void draw();  // 默认为 public abstract
    
    // Java 8 后，接口可以有默认方法
    default void display() {
        System.out.println("显示图形");
    }
    
    // Java 8 后，接口可以有静态方法
    static void info() {
        System.out.println("这是可绘制接口");
    }
}

public class Rectangle extends Shape implements Drawable {
    private double width;
    private double height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public void draw() {
        System.out.println("绘制一个" + color + "矩形");
    }
}
```

接口与抽象类的区别：
- 接口只能包含常量、抽象方法、默认方法和静态方法
- 接口中的成员默认是 public
- 类可以实现多个接口，但只能继承一个类
- 接口不能包含构造方法和实例变量

## 其他重要概念

### 内部类

内部类是定义在另一个类内部的类。内部类可以访问外部类的所有成员，包括私有成员。

```java
public class OuterClass {
    private int outerField = 10;
    
    // 成员内部类
    public class InnerClass {
        public void display() {
            System.out.println("OuterField: " + outerField);
        }
    }
    
    // 静态内部类
    public static class StaticInnerClass {
        public void display() {
            // 静态内部类不能直接访问外部类的非静态成员
            // System.out.println("OuterField: " + outerField); // 错误
        }
    }
    
    public void method() {
        // 局部内部类
        class LocalInnerClass {
            public void display() {
                System.out.println("OuterField: " + outerField);
            }
        }
        
        LocalInnerClass lic = new LocalInnerClass();
        lic.display();
        
        // 匿名内部类
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("OuterField: " + outerField);
            }
        };
        new Thread(runnable).start();
    }
}
```

内部类的类型：
- 成员内部类
- 静态内部类
- 局部内部类
- 匿名内部类

### 枚举类型

枚举是一种特殊的类，表示一组常量。

```java
public enum Season {
    SPRING("春天", "温暖"),
    SUMMER("夏天", "炎热"),
    AUTUMN("秋天", "凉爽"),
    WINTER("冬天", "寒冷");
    
    private final String name;
    private final String description;
    
    // 枚举构造方法必须是私有的
    private Season(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
}

// 使用枚举
Season season = Season.SPRING;
System.out.println(season.getName() + "：" + season.getDescription());
```

## 最佳实践

### 1. 合理使用访问修饰符

- 属性通常应该是 private，通过公共的 getter 和 setter 方法访问
- 不需要被外部访问的方法应该声明为 private
- 只需要被子类访问的方法应该声明为 protected

### 2. 遵循单一职责原则

每个类应该只有一个职责，一个类只做一件事。

```java
// 不好的设计：一个类负责多个职责
class UserService {
    public void registerUser() { /* ... */ }
    public void sendEmail() { /* ... */ }
    public void saveUserToDatabase() { /* ... */ }
}

// 好的设计：职责分离
class UserService {
    private EmailService emailService;
    private UserRepository userRepository;
    
    public void registerUser() {
        // 注册用户逻辑
        userRepository.saveUser();
        emailService.sendWelcomeEmail();
    }
}

class EmailService {
    public void sendWelcomeEmail() { /* ... */ }
}

class UserRepository {
    public void saveUser() { /* ... */ }
}
```

### 3. 避免过深的继承层次

继承层次不应该过深，通常不超过 3 层。过深的继承会导致代码难以理解和维护。优先使用组合而非继承。

```java
// 组合优于继承
class Car {
    private Engine engine;
    private Transmission transmission;
    
    public Car(Engine engine, Transmission transmission) {
        this.engine = engine;
        this.transmission = transmission;
    }
    
    public void start() {
        engine.start();
    }
    
    public void changeGear(int gear) {
        transmission.changeGear(gear);
    }
}

class Engine {
    public void start() { /* ... */ }
}

class Transmission {
    public void changeGear(int gear) { /* ... */ }
}
```

### 4. 使用接口定义行为

通过接口定义行为，提高代码的灵活性和可测试性。

```java
// 定义接口
public interface PaymentProcessor {
    boolean processPayment(double amount);
}

// 实现接口
public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // 信用卡支付逻辑
        return true;
    }
}

public class PayPalProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // PayPal 支付逻辑
        return true;
    }
}

// 使用接口
public class PaymentService {
    private PaymentProcessor processor;
    
    public PaymentService(PaymentProcessor processor) {
        this.processor = processor;
    }
    
    public boolean pay(double amount) {
        return processor.processPayment(amount);
    }
}
```

### 5. 使用构造器模式处理复杂对象创建

当对象构造需要很多参数时，使用构建器模式使代码更加清晰。

```java
public class User {
    // 必需参数
    private final String firstName;
    private final String lastName;
    
    // 可选参数
    private final int age;
    private final String phone;
    private final String address;
    private final String email;
    
    private User(UserBuilder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
        this.email = builder.email;
    }
    
    // getter 方法略
    
    public static class UserBuilder {
        // 必需参数
        private final String firstName;
        private final String lastName;
        
        // 可选参数
        private int age;
        private String phone;
        private String address;
        private String email;
        
        public UserBuilder(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        public UserBuilder age(int age) {
            this.age = age;
            return this;
        }
        
        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public UserBuilder address(String address) {
            this.address = address;
            return this;
        }
        
        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// 使用构建器
User user = new User.UserBuilder("张", "三")
    .age(30)
    .phone("13812345678")
    .address("北京市海淀区")
    .email("zhangsan@example.com")
    .build();
```

## 常见问题

### 1. Java 中的多态如何实现？

Java 的多态主要通过继承和接口实现。通过将子类对象赋给父类引用，可以实现在运行时根据实际对象类型调用相应的方法。

### 2. 抽象类和接口有什么区别？

抽象类可以有构造方法、成员变量和实现方法，而接口主要包含抽象方法（Java 8 后可以有默认方法和静态方法）。类只能继承一个抽象类，但可以实现多个接口。

### 3. 什么是方法重载和方法重写？

方法重载是指在同一个类中定义多个名称相同但参数列表不同的方法。方法重写是指子类提供父类方法的特定实现。

### 4. 为什么需要封装？

封装隐藏了实现细节，保护数据不被外部直接访问和修改，提高了代码的安全性、灵活性和可维护性。通过提供公共接口，封装使得内部实现可以独立变化而不影响外部调用者。

## 参考资料

- [Oracle Java Documentation](https://docs.oracle.com/javase/tutorial/java/concepts/)
- [Effective Java (Joshua Bloch)](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)
- [Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin)](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) 