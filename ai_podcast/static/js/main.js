// 初始化变量
const API_KEY = 'YOUR_API_KEY';
const GROUP_ID = 'YOUR_GROUP_ID';

// DOM元素引用
const elements = {
  togglePrompt: document.getElementById('togglePrompt'),
  promptContainer: document.getElementById('promptContainer'),
  systemPrompt: document.getElementById('systemPrompt'),
  savePrompt: document.getElementById('savePrompt'),
  originalContent: document.getElementById('originalContent'),
  clearInput: document.getElementById('clearInput'),
  generateContent: document.getElementById('generateContent'),
  aiOutput: document.getElementById('aiOutput'),
  copyOutput: document.getElementById('copyOutput'),
  clearOutput: document.getElementById('clearOutput'),
  synthesizeVoice: document.getElementById('synthesizeVoice'),
  voiceControlSection: document.getElementById('voiceControlSection'),
  playVoice: document.getElementById('playVoice'),
  pauseVoice: document.getElementById('pauseVoice'),
  downloadVoice: document.getElementById('downloadVoice'),
  voiceSpeed: document.getElementById('voiceSpeed'),
  voiceVolume: document.getElementById('voiceVolume'),
  voicePitch: document.getElementById('voicePitch'),
  voiceEmotion: document.getElementById('voiceEmotion'),
  speedValue: document.getElementById('speedValue'),
  volumeValue: document.getElementById('volumeValue'),
  pitchValue: document.getElementById('pitchValue'),
  liveToast: document.getElementById('liveToast')
};

// 音频播放器
const audioPlayer = new Audio();
let currentAudioBlob = null;

// 初始化页面
function init() {
  // 从localStorage加载保存的提示词
  const savedPrompt = localStorage.getItem('systemPrompt');
  if (savedPrompt) {
    elements.systemPrompt.value = savedPrompt;
  } else {
    // 设置默认提示词
    elements.systemPrompt.value = `你是一档名为《降噪》的AI科技广播节目的资深编辑，名字叫AI产品黄叔，擅长将专业的AI文章转化为通俗易懂的广播内容。请将以下原始内容改写成适合播报的稿件。\n\n原始内容\n{{input}}\n====End======\n\n要求：\n1. 请先全面的阅读一遍所有的新闻\n2. 使用AI产品黄叔的身份，用幽默风趣的大白话，给AI小白讲清楚最新的资讯\n3. 开场先概要说说今天发生了哪些大事\n4. 每个新闻控制在100字以内，确保听众能在短时间内抓住重点\n5. 语言风格要求：\n   - 用生动的口语化表达，用大白话讲出专业性\n   - 适当使用语气词增加自然感（比如"嗯"、"那么"、"其实"等）\n   - 避免过于口语化的方言用语\n   - 像跟朋友聊天一样轻松自然\n6. 在保持通俗易懂的同时，准确传达AI技术的关键概念\n7. 适当增加转场语，使话题之间衔接自然`;
  }
  
  // 设置语音参数显示
  updateSliderValues();
  
  // 初始化Toast
  const toast = new bootstrap.Toast(elements.liveToast);
}

// 更新滑块值显示
function updateSliderValues() {
  elements.speedValue.textContent = elements.voiceSpeed.value;
  elements.volumeValue.textContent = elements.voiceVolume.value;
  elements.pitchValue.textContent = elements.voicePitch.value;
}

// 显示Toast消息
function showToast(message, type = 'info') {
  const toastBody = document.querySelector('.toast-body');
  toastBody.textContent = message;
  
  const toast = new bootstrap.Toast(elements.liveToast);
  toast.show();
}

// 事件监听器设置
function setupEventListeners() {
  // 提示词区域切换
  elements.togglePrompt.addEventListener('click', () => {
    const isCollapsed = elements.promptContainer.classList.contains('collapse');
    elements.togglePrompt.textContent = isCollapsed ? '折叠' : '展开';
    new bootstrap.Collapse(elements.promptContainer, { toggle: true });
  });
  
  // 保存提示词
  elements.savePrompt.addEventListener('click', () => {
    localStorage.setItem('systemPrompt', elements.systemPrompt.value);
    showToast('提示词已保存');
  });
  
  // 清空输入
  elements.clearInput.addEventListener('click', () => {
    elements.originalContent.value = '';
    showToast('输入已清空');
  });
  
  // 生成广播稿
  elements.generateContent.addEventListener('click', async () => {
    if (!elements.originalContent.value.trim()) {
      showToast('请输入原始内容');
      return;
    }
    
    try {
      const response = await generateBroadcastScript(
        elements.systemPrompt.value,
        elements.originalContent.value
      );
      
      elements.aiOutput.innerHTML = response.replace(/\n/g, '<br>');
      elements.voiceControlSection.style.display = 'block';
    } catch (error) {
      showToast(`生成失败: ${error.message}`, 'error');
    }
  });
  
  // 复制输出
  elements.copyOutput.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.aiOutput.innerText);
    showToast('内容已复制');
  });
  
  // 清空输出
  elements.clearOutput.addEventListener('click', () => {
    elements.aiOutput.innerHTML = '';
    showToast('输出已清空');
  });
  
  // 语音合成
  elements.synthesizeVoice.addEventListener('click', async () => {
    if (!elements.aiOutput.innerText.trim()) {
      showToast('请先生成广播稿');
      return;
    }
    
    try {
      const audioData = await synthesizeVoice(
        elements.aiOutput.innerText,
        {
          voice_id: 'superhuangclone',
          speed: parseFloat(elements.voiceSpeed.value),
          vol: parseFloat(elements.voiceVolume.value),
          pitch: parseFloat(elements.voicePitch.value),
          emotion: elements.voiceEmotion.value
        }
      );
      
      currentAudioBlob = new Blob([audioData], { type: 'audio/mp3' });
      audioPlayer.src = URL.createObjectURL(currentAudioBlob);
      showToast('语音合成完成');
    } catch (error) {
      showToast(`语音合成失败: ${error.message}`, 'error');
    }
  });
  
  // 播放语音
  elements.playVoice.addEventListener('click', () => {
    if (!currentAudioBlob) {
      showToast('请先合成语音');
      return;
    }
    audioPlayer.play();
  });
  
  // 暂停语音
  elements.pauseVoice.addEventListener('click', () => {
    audioPlayer.pause();
  });
  
  // 下载语音
  elements.downloadVoice.addEventListener('click', () => {
    if (!currentAudioBlob) {
      showToast('没有可下载的语音');
      return;
    }
    
    const url = URL.createObjectURL(currentAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '降噪广播.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  
  // 滑块值变化
  elements.voiceSpeed.addEventListener('input', updateSliderValues);
  elements.voiceVolume.addEventListener('input', updateSliderValues);
  elements.voicePitch.addEventListener('input', updateSliderValues);
}

// 生成广播稿
async function generateBroadcastScript(systemPrompt, userInput) {
  const url = 'https://api.minimax.chat/v1/text/chatcompletion_v2';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'MiniMax-Text-01',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userInput
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// 语音合成
async function synthesizeVoice(text, voiceSetting) {
  const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${GROUP_ID}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'speech-01-turbo',
      text: text,
      stream: false,
      voice_setting: voiceSetting,
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: 'mp3',
        channel: 1
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`语音合成失败: ${response.status}`);
  }
  
  return await response.arrayBuffer();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
  init();
  setupEventListeners();
});