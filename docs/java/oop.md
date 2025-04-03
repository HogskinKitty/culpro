# 面向对象

面向过程编程（Procedural-Oriented Programming，POP）和面向对象编程（Object-Oriented Programming，OOP）是两种常见的编程范式，两者的主要区别在于解决问题的方式不同：

- 面向过程编程（POP）：面向过程把解决问题的过程拆成一个个方法，通过一个个方法的执行解决问题。

- 面向对象编程（OOP）：面向对象会先抽象出对象，然后用对象执行方法的方式解决问题。

## 类与对象

1. **类**

类是一组具有某类事物相关的属性和行为的集合。

定义类的语法格式：`访问权限修饰符 class 类名 {}`

```java
public class Animal {
    
    public void eat() {
        System.out.println("Eating...");
    }
}
```

2. **对象**

对象是具备某类事物具体属性和行为的体现。

对象的创建语法格式：`类名 对象名 = new 类名();`

在类中定义的方法，在类外无法直接调用，需要先实例化对象，再调用方法。

```java
public void CreateInstance() {
    // 对象实例化
    Animal animal = new Animal();
    
    // 调用方法
    animal.eat();
}
```

## 方法

方法就是完成特定功能的代码块。

语法格式：`访问权限修饰符 返回值类型 方法名(参数类型 参数名) {
// 方法体
}`

```java
public class Animal {
    
    // 普通方法
    public void eat() {
        System.out.println("Eating...");
    }
}
```

### 方法的分类

1. **普通方法**

在类中定义的方法，在类外可以直接调用。

```java
public class Animal {
    
    public void eat() {
        System.out.println("Eating...");
    }
}
```

2. **静态方法**

使用 `static` 关键字修饰的方法，在类外可以直接调用。

```java
public class Animal {
    
    public static void sleep() {
        System.out.println("Sleeping...");
    }
}
```

3. **构造方法**

构造是一种特殊方法，方法名和类名相同，没有显式的返回值声明，可以包含 return 语句用于提前终止（但不能返回值）。

主要用于显式初始化对象成员变量。当未显式定义构造方法时，编译器会自动生成默认无参构造方法。

```java
public class Animal {
    
    private String name;
    
    /**
     * 无参构造方法
     */
    public Animal() {
    
    }
    
    /**
     * 有参构造方法
     */
    public Animal(String name) {
        this.name = name;
    }
}
```

> [!warning]注意
> - 每一个类都默认有一个无参构造方法。
> - 如果在类中显示定义了构造方法（无论有参还是无参），默认无参将会消失。
> - 如果类中没有无参构造方法，将不能使用空参方式创建对象。
> - 构造方法支持方法重载，可以使用关键字 this 来相互调用。

### 方法的重写

子类重写父类方法，方法签名完全一致（方法名、参数、返回类型）。主要是用于扩展父类功能。

> [!tip]方法签名
> 方法签名是 Java 中方法的唯一标识符，由方法名称和参数列表（参数类型、顺序、数量）组成，不包括返回类型、访问修饰符和异常声明。

- 返回值类型需保持一致或是其父类的子类

- 访问权限修饰符需大于等于其父类的访问权限修饰符

- 子类异常不能比其父类异常更宽

```java
public class Animal {
    
    public void eat() {
        System.out.println("Eating...");
    }
}

public class Dog extends Animal {
    
    @Override
    public void eat() {
        System.out.println("Dog is eating...");
    }
}
```

### 方法的重载

同一类中，方法名相同，参数列表不同（类型、顺序、数量）即实现方法的重载。

- 仅通过参数列表区分方法，与返回类型、访问修饰符无关。

- 可抛出不同异常，或不同访问权限（如 `public` 和 `private`）。

```java
public class Animal {
    
    public void eat() {
        System.out.println("Eating...");
    }
    
    void eat(String food) {
        System.out.println("Eating " + food + "...");
    }
}
```

## 面向对象三大特性

### 1. 封装

封装就是把数据（属性）和操作数据的方法（行为）封装到一个类中，对外隐藏实现细节，只对外提供公共的访问方式。

语法格式：`访问权限修饰符 数据类型 变量名;`

```java
public class Animal {
    
    private String name; // 私有属性
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getName() { // 公有方法访问私有属性
        return name;
    }
}
```

### 2. 继承

子类继承父类的非私有属性和方法（不包括构造方法），实现代码复用。

Java 使用 `extends` 关键字实现单继承。子类可以通过父类提供的公共方法间接访问其
private 成员，但不能直接继承这些 private 成员。

语法格式：`子类 extends 父类`

```java
public class Animal { // 父类
    
    public void eat() {
        System.out.println("Eating...");
    }
}

public class Dog extends Animal { // 子类
    
    public void bark() {
        System.out.println("Barking...");
    }
}
```

### 3. 多态

表示一个对象具有多种的状态，具体表现为父类的引用指向子类的实例。

- 对象类型和引用类型之间具有继承（类）/实现（接口）的关系

- 引用类型变量发出的方法调用的到底是哪个类中的方法，必须在程序运行期间才能确定（动态绑定）。JVM
  通过方法表实现动态绑定，在类加载时为每个类创建方法表，包含实际可调用的方法入口地址。调用方法时，虚拟机会通过对象实际类型的方法表确定具体实现

- 多态不能调用只在子类存在但在父类不存在的方法；如果子类重写了父类的方法，真正执行的是子类重写的方法，如果子类没有重写父类的方法，执行的是父类的方法

```java
// 接口多态示例
interface Animal {
    
    void eat();
}

class Dog implements Animal {
    
    @Override
    public void eat() {
        System.out.println("Dog eats bone");
    }
}

class Cat implements Animal {
    
    @Override
    public void eat() {
        System.out.println("Cat eats fish");
    }
}

public class TestPolymorphism {
    
    public static void main(String[] args) {
        Animal animal1 = new Dog();
        Animal animal2 = new Cat();
        
        feed(animal1);  // 输出 Dog eats bone
        feed(animal2);  // 输出 Cat eats fish
    }
    
    public static void feed(Animal animal) {
        animal.eat();
    }
}
```

向上转型：父类引用指向子类实例，子类实例可以赋值给父类引用。

语法格式：`父类类型 变量名 = new 子类类型();`

```java
public class Animal {
    
    public void eat() {
        System.out.println("Animal is eating...");
    }
}

public class Dog extends Animal {
    
    public void bark() {
        System.out.println("Dog is barking...");
    }
}

Animal animal = new Cat();
```

向下转型：子类引用指向父类实例，父类实例不能赋值给子类引用。需要强制转换。使用 instanceof 关键字判断类型是否匹配，否则会报类型转换异常。

语法格式：`子类类型 变量名 = (子类类型) 父类类型变量名;`

```java
public class Animal {
    
    public void eat() {
        System.out.println("Animal is eating...");
    }
}

public class Dog extends Animal {
    
    public void bark() {
        System.out.println("Dog is barking...");
    }
}

public class TestDowncast {
    
    public static void main(String[] args) {
        Animal animal = new Dog();
        if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
        }
    }
}
```

## 抽象类

抽象类是一种特殊的类，不能被实例化，只能被继承。

- 抽象类中可以包含抽象方法和普通方法。

- 抽象方法是一种没有实现的方法，必须在子类中实现。

语法格式：`访问权限修饰符 abstract class 类名 {}`

```java
public abstract class Animal {
    
    public abstract void eat(); // 抽象方法
}
```

> [!warning]注意
> - 抽象类中可以有构造方法，但不能进行实例化，主要是用于子类访问父类的数据时进行初始化，因为抽象类中可以定义非抽象方法。
> - 抽象类的子类，如果是抽象类，不用重写抽象方法。如果不是抽象类必须重写父抽象类中的所有抽象方法。

## 接口

接口其实可以说是一种规范，可以避免一些类在设计上的不一致，还可以使代码拥有良好的扩展性。

接口是一种特殊的类，不能被实例化，只能被实现。

- 接口是纯抽象类，不能有实例变量，只能有常量和抽象方法。

- 接口中的抽象方法没有方法体，必须由实现接口的类提供实现。

语法格式：`访问权限修饰符 interface 接口名 {}`

```java
public interface Animal {
    
    void eat();
}

public class Dog implements Animal {
    
    public void eat() {
        System.out.println("Dog is eating...");
    }
}
```

## 接口和抽象类的区别

> [!note] JDK8 接口新特性
> - 允许使用`static`修饰符定义静态方法，可通过接口名直接调用
> - 允许使用`default`修饰符定义默认方法，提供默认实现，子类可选择重写
> - 接口成员变量默认隐含`public static final`修饰符

1. **成员区别**

- 接口是纯抽象类，不能有实例变量，只能有常量（默认 public static final 修饰）和抽象方法。从 JDK8 开始支持静态方法（static 修饰）和默认方法（default
  修饰）的实现

- 抽象类可以有实例变量，可以有常量和抽象方法、构造方法

2. **关系区别**

- 类与类之间是单继承关系

- 类与接口之间是实现关系（单实现、多实现）

- 接口与接口之间是继承关系（单继承、多继承）

3. **设计理念区别**

- 抽象类：被继承体现的是："is a" 的关系。抽象类中定义的是该继承体系的共性功能

- 接口：被实现体现的是："like a" 的关系。接口中定义的是该继承体系的扩展功能

## 知识补充

### 访问权限修饰符

| 修饰符名称     | 访问范围              |
|-----------|-------------------|
| public    | 公共的，可以在任何地方访问     |
| private   | 私有的，只能在类内部访问      |
| protected | 受保护的，只能在当前类和子类中访问 |
| default   | 默认的，只能在当前包中访问     |

### 代码块

代码块是由大括号 {} 包围的一段代码，用于组织代码逻辑、控制变量作用域或实现初始化操作。

Java 代码块按功能和位置分为四种类型：

1. **实例代码块**

- 定义在类中方法外，用 {} 包围，无任何修饰符，每次创建对象时执行

- 用于对象实例的通用初始化操作

- 在多个构造函数之间共享代码，避免重复

- 执行顺序：父类初始化块 → 子类初始化块 → 构造方法

```java
public class InitDemo {
    
    // 实例代码块
    {
        System.out.println("实例初始化块执行");
    }
    
    public InitDemo() {
        System.out.println("构造方法执行");
    }
}
```

2. **静态代码块**

- 使用 `static` 修饰，在类首次加载时执行一次

- 触发时机：
    - Class.forName() 显式加载
    - 首次创建实例
    - 访问静态成员

- 用于初始化静态资源（数据库连接池等）

```java
class ResourceLoader {
    
    // 静态初始化块
    static {
        System.out.println("类加载时初始化");
        loadConfigurations();
    }
    
    static void loadConfigurations() {
        // 加载静态资源配置
    }
}
```

3. **局部代码块**

- 定义在方法内部的 {} 块，限定变量生命周期

- 典型应用场景：
    - 循环控制中的临时变量隔离
    - 资源释放的保证
    - 复杂方法中的逻辑分组

```java
void processData() {
    // 方法级作用域
    int outer = 10;
    
    { // 局部代码块
        int inner = 20;
        System.out.println(inner); // 有效
    }
    
    // System.out.println(inner); // 编译错误-变量超出作用域
    System.out.println(outer); // 有效
}
```

4. **同步代码块**

- 使用 `synchronized` 控制并发访问

- 比同步方法更细粒度的锁控制

- 锁对象建议使用专用 Object 实例而非 this

```java
class Counter {
    
    private int count = 0;
    
    private final Object lock = new Object();
    
    void increment() {
        synchronized (lock) { // 同步代码块
            count++;
        }
    }
}
```

> [!tip] 初始化顺序
> 1. 静态初始化块（类加载时）
> 2. 实例初始化块（每次 new 对象时）
> 3. 构造方法
> 4. 局部代码块

### 常用关键字

### 1. final 关键字

`final` 关键字用于声明不可变的实体，包含三种使用场景：

**定义**

- 修饰类：不可被继承

- 修饰方法：不可被重写

- 修饰变量：初始化后不可修改（常量）

**作用范围**

```java
// final 类示例
final class MathUtils {
    // 工具类禁止继承
}

// final 方法示例
class Parent {
    
    public final void validate() {
        // 关键校验方法禁止重写
    }
}

// final 变量示例
class Constants {
    
    public static final double PI = 3.1415926; // 全局常量
}
```

**典型应用**

- 工具类设计（如 String 类）

- 常量值定义（配置参数）

- 核心算法方法保护

> [!warning]注意
> final 修饰引用类型时，仅限制引用不可变，对象内容仍可修改

### 2. static 关键字

`static` 用于创建类级别成员，与实例无关。

**定义**

- 静态变量：类所有实例共享

- 静态方法：只能访问静态成员

- 静态代码块：类加载时执行

- 静态内部类：不依赖外部实例

**作用范围**

```java
class Counter {
    
    static int count = 0; // 类变量
    
    static {
        // 静态初始化块
        System.out.println("类加载时初始化");
    }
    
    public static void printCount() {
        System.out.println(count);
    }
    
    static class Helper { /* 静态内部类 */
    
    }
}
```

**典型应用**

- 工具方法（如 Collections.sort）

- 共享数据（如连接池）

- 静态工厂方法

> [!tip]内存分配
> 静态成员存储在方法区，生命周期与类相同

### 3. this 关键字

`this` 表示当前对象的引用。

**定义**

- 实例方法中隐含的当前对象

- 构造器中调用其他构造器

**作用范围**

```java
class Person {
    
    private String name;
    
    public Person() {
        this("Unknown"); // 调用有参构造器
    }
    
    public Person(String name) {
        this.name = name; // 区分成员变量与参数
    }
    
    public void printInfo() {
        System.out.println(this); // 输出对象地址
    }
}
```

**典型应用**

- 解决名称遮蔽问题

- 实现链式调用（return this）

- 构造器重载调用

### 4. super 关键字

`super` 用于访问父类成员

**定义**

- 调用父类构造器（必须首行）

- 访问父类被覆盖的方法

- 访问父类隐藏的字段

**作用范围**

```java
class Vehicle {
    
    protected String type = "Transport";
    
    public void showType() {
        System.out.println(type);
    }
}

class Car extends Vehicle {
    
    private String type = "Automobile";
    
    public Car() {
        super(); // 调用父类构造器
    }
    
    @Override
    public void showType() {
        System.out.println("子类类型: " + type);
        System.out.println("父类类型: " + super.type);
    }
}
```

**典型应用**

- 继承体系中的构造器链

- 模板方法模式实现

- 访问被重写的父类方法

> [!warning]层级限制
> super 不能跨越多个继承层级，只能访问直接父类成员






