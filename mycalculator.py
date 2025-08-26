import tkinter as tk

def button_click(number):
    current = entry.get()
    entry.delete(0, tk.END)
    entry.insert(0, current + str(number))

def button_clear():
    entry.delete(0, tk.END)

def button_equal():
    try:
        expression = entry.get()
        result = eval(expression)
        entry.delete(0, tk.END)
        entry.insert(0, result)
    except:
        entry.delete(0, tk.END)
        entry.insert(0, "Error")

# 创建主窗口
root = tk.Tk()
root.title("简单计算器")

# 创建输入框
entry = tk.Entry(root, width=35, borderwidth=5)
entry.grid(row=0, column=0, columnspan=3, padx=10, pady=10)

# 创建按钮
buttons = [
    ('7', 1, 0), ('8', 1, 1), ('9', 1, 2),
    ('4', 2, 0), ('5', 2, 1), ('6', 2, 2),
    ('1', 3, 0), ('2', 3, 1), ('3', 3, 2),
    ('0', 4, 0), ('.', 4, 1), ('=', 4, 2),
    ('+', 1, 3), ('-', 2, 3), ('*', 3, 3), ('/', 4, 3),
    ('C', 0, 3)
]

for (text, row, col) in buttons:
    if text == '=':
        button = tk.Button(root, text=text, padx=40, pady=20, command=button_equal)
    elif text == 'C':
        button = tk.Button(root, text=text, padx=40, pady=20, command=button_clear)
    else:
        button = tk.Button(root, text=text, padx=40, pady=20, command=lambda num=text: button_click(num))
    button.grid(row=row, column=col)

# 运行主循环
root.mainloop()