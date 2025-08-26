import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import serial
import serial.tools.list_ports
from threading import Thread, Event
from queue import Queue
from datetime import datetime

class SerialDebugger:
    def __init__(self, master):
        self.master = master
        self.master.title("串口调试工具")
        
        # 串口参数
        self.serial_port = None
        self.stop_event = Event()
        self.receive_buffer = b''
        self.display_mode = 'ASCII'  # ASCII/HEX
        self.show_timestamp = True
        self.receive_queue = Queue()

        # 创建UI组件
        self.create_widgets()
        self.update_ports()

    def create_widgets(self):
        # 顶部控制面板
        control_frame = ttk.Frame(self.master, padding=10)
        control_frame.pack(fill=tk.X)

        # 串口选择
        ttk.Label(control_frame, text="端口:").grid(row=0, column=0)
        self.port_combo = ttk.Combobox(control_frame, width=10)
        self.port_combo.grid(row=0, column=1)
        
        # 波特率选择
        ttk.Label(control_frame, text="波特率:").grid(row=0, column=2)
        self.baud_combo = ttk.Combobox(control_frame, values=[
            '9600', '19200', '38400', '57600', '115200'], width=8)
        self.baud_combo.set('9600')
        self.baud_combo.grid(row=0, column=3)

        # 操作按钮
        self.connect_btn = ttk.Button(control_frame, text="打开端口", command=self.toggle_connection)
        self.connect_btn.grid(row=0, column=4, padx=5)
        ttk.Button(control_frame, text="刷新端口", command=self.update_ports).grid(row=0, column=5)

        # 发送区
        send_frame = ttk.Frame(self.master, padding=10)
        send_frame.pack(fill=tk.X)
        
        ttk.Label(send_frame, text="发送指令:").pack(anchor=tk.W)
        self.send_entry = ttk.Entry(send_frame, width=40)
        self.send_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(send_frame, text="发送", command=self.send_data).pack(side=tk.LEFT, padx=5)

        # 显示控制面板
        display_frame = ttk.Frame(self.master, padding=10)
        display_frame.pack(fill=tk.X)
        self.hex_mode = tk.BooleanVar()
        ttk.Checkbutton(display_frame, text="HEX模式", variable=self.hex_mode,
                      command=self.toggle_display_mode).pack(side=tk.LEFT)
        self.ts_mode = tk.BooleanVar(value=True)
        ttk.Checkbutton(display_frame, text="显示时间戳", variable=self.ts_mode,
                       command=lambda: setattr(self, 'show_timestamp', self.ts_mode.get())).pack(side=tk.LEFT)

        # 接收区
        receive_frame = ttk.Frame(self.master)
        receive_frame.pack(fill=tk.BOTH, expand=True, padx=10)
        
        self.receive_text = scrolledtext.ScrolledText(receive_frame, wrap=tk.WORD, height=15)
        self.receive_text.pack(fill=tk.BOTH, expand=True)

        # 状态栏
        self.status_bar = ttk.Label(self.master, text="就绪")
        self.status_bar.pack(fill=tk.X)

    def update_ports(self):
        ports = [port.device for port in serial.tools.list_ports.comports()]
        self.port_combo['values'] = ports
        if ports:
            self.port_combo.current(0)

    def toggle_connection(self):
        if self.serial_port and self.serial_port.is_open:
            self.close_serial()
        else:
            self.open_serial()

    def open_serial(self):
        try:
            self.serial_port = serial.Serial(
                port=self.port_combo.get(),
                baudrate=int(self.baud_combo.get()),
                timeout=1
            )
            self.connect_btn.config(text="关闭端口")
            self.status_bar.config(text=f"已连接 {self.port_combo.get()}")
            Thread(target=self.receive_data, daemon=True).start()
        except Exception as e:
            messagebox.showerror("连接错误", str(e))

    def close_serial(self):
        if self.serial_port:
            self.serial_port.close()
        self.connect_btn.config(text="打开端口")
        self.status_bar.config(text="已断开连接")

    def send_data(self):
        data = self.send_entry.get()
        if self.serial_port and self.serial_port.is_open:
            try:
                tx_data = bytes.fromhex(data) if self.hex_mode.get() else data.encode()
                self.serial_port.write(tx_data)
                timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3] if self.show_timestamp else ''
                self.receive_queue.put((timestamp, tx_data, 'TX'))
                self.master.after(50, self.update_ui)
                self.send_entry.delete(0, tk.END)
            except Exception as e:
                messagebox.showerror("发送错误", str(e))

    def toggle_display_mode(self):
        self.display_mode = 'HEX' if self.hex_mode.get() else 'ASCII'

    def format_data(self, data):
        if self.display_mode == 'HEX':
            return ' '.join(f'{b:02X}' for b in data)
        return data.decode(errors='replace')

    def update_ui(self):
        while not self.receive_queue.empty():
            timestamp, data, direction = self.receive_queue.get()
            prefix = f"{timestamp} {'发送' if direction == 'TX' else '接收'}: "
            formatted = self.format_data(data)
            self.receive_text.insert(tk.END, f"{prefix}{formatted}\n")
            self.receive_text.see(tk.END)

    def receive_data(self):
        while self.serial_port.is_open:
            try:
                # 读取所有可用数据
                data = self.serial_port.read_all(self.serial_port.in_waiting or 1)
                print(data)
                if data:
                    self.receive_buffer += data
                    # 查找完整帧（换行符作为分隔）
                    while b'\n' in self.receive_buffer:
                        line, self.receive_buffer = self.receive_buffer.split(b'\n', 1)
                        timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3] if self.show_timestamp else ''
                        self.receive_queue.put((timestamp, line, 'RX'))
                self.master.after(50, self.update_ui)
            except (serial.SerialException, OSError):
                break

if __name__ == "__main__":
    root = tk.Tk()
    app = SerialDebugger(root)
    root.mainloop()