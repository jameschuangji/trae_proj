def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "不能除以零"

operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide
}

print("简易计算器（输入'exit'退出）")
while True:
    try:
        num1 = float(input("输入第一个数字: "))
        operator = input("选择操作 (+ - * /): ")
        if operator.lower() == 'exit':
            break
        num2 = float(input("输入第二个数字: "))
        
        result = operations[operator](num1, num2)
        print(f"结果: {result}\n")
        
    except ValueError:
        print("错误：请输入有效数字\n")
    except KeyError:
        print("错误：无效操作符\n")
    except KeyboardInterrupt:
        print("\n程序已退出")
        break
