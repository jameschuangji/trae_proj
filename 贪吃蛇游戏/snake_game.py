import tkinter as tk
import random

class SnakeGame:
    def __init__(self, master):
        self.master = master
        self.master.title("贪吃蛇")
        self.width = 600
        self.height = 400
        self.cell_size = 20
        
        # 初始化游戏区域
        self.canvas = tk.Canvas(master, width=self.width, height=self.height, bg='black')
        self.canvas.pack()
        
        # 初始化蛇
        self.snake = [(100, 100), (80, 100), (60, 100)]
        self.snake_positions = set(self.snake)
        self.direction = 'Right'

        # 生成食物
        self.food = self.create_food()

        # 分数显示
        self.score = 0
        self.score_label = tk.Label(master, text="分数: 0", fg='white', bg='black', font=('Arial', 14))
        self.score_label.pack()

        # 绑定键盘事件
        self.master.bind('<Key>', self.change_direction)
        
        # 开始游戏循环
        self.game_loop()

    def create_food(self):
        # 预计算网格坐标
        columns = self.width // self.cell_size
        rows = self.height // self.cell_size
        all_grid = {(x * self.cell_size, y * self.cell_size) 
                   for x in range(columns) for y in range(rows)}
        available = all_grid - self.snake_positions
        
        if not available:
            return None
        
        food_pos = random.choice(list(available))
        # Bug 修复：原代码中的参数类型与 `create_rectangle` 方法的重载不匹配，推测是缺少 `width` 参数，现补充参数
        self.canvas.create_rectangle(
            int(food_pos[0]),
            int(food_pos[1]),
            int(food_pos[0] + self.cell_size),
            int(food_pos[1] + self.cell_size),
            fill='red',
            width=1,
            tags='food'
        )
        return food_pos

    def change_direction(self, event):
        key = event.keysym
        if (key in ['Up', 'Down', 'Left', 'Right'] 
            and (key == 'Up' and self.direction != 'Down') 
            or (key == 'Down' and self.direction != 'Up') 
            or (key == 'Left' and self.direction != 'Right') 
            or (key == 'Right' and self.direction != 'Left')):
            self.direction = key

    def game_loop(self):
        # 移动蛇头
        head_x, head_y = self.snake[0]
        if self.direction == 'Up':
            new_head = (head_x, head_y - self.cell_size)
        elif self.direction == 'Down':
            new_head = (head_x, head_y + self.cell_size)
        elif self.direction == 'Left':
            new_head = (head_x - self.cell_size, head_y)
        else:
            new_head = (head_x + self.cell_size, head_y)

        # 碰撞检测
        if (new_head in self.snake 
            or new_head[0] < 0 
            or new_head[0] >= self.width 
            or new_head[1] < 0 
            or new_head[1] >= self.height):
            self.game_over()
            return

        self.snake.insert(0, new_head)
        self.snake_positions.add(new_head)  # 更新坐标集合

        # 吃食物检测
        if new_head == self.food:
            self.score += 10
            # 确保在初始化时正确创建了 score_label
            if hasattr(self, 'score_label'):
                self.score_label.config(text=f"分数: {self.score}")
            self.canvas.delete('food')
            self.food = self.create_food()
        else:
            # 移除蛇尾
            self.canvas.delete('snake')
            tail = self.snake.pop()
            self.snake_positions.remove(tail)  # 更新坐标集合


        # 重绘蛇身
        for x, y in self.snake:
            self.canvas.create_rectangle(
                int(x),
                int(y),
                int(x + self.cell_size),
                int(y + self.cell_size),
                fill='green',
                tags='snake'
            )

        self.master.after(150, self.game_loop)

    def game_over(self):
        self.canvas.create_text(self.width/2, self.height/2, 
                               text=f"游戏结束！得分: {self.score}", 
                               fill='white', 
                               font=('Arial', 24))

if __name__ == "__main__":
    root = tk.Tk()
    game = SnakeGame(root)
    root.mainloop()
# 删除重复的__init__方法定义