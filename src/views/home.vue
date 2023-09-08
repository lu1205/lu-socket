<script setup>
import { ref, onMounted, onUnmounted, nextTick, watchEffect } from "vue";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
// 监听连接成功
socket.on("connect", () => {
  console.log(socket);
});
// socket连接失败
socket.on("disconnect", () => {
  console.log(socket);
});

// 监听服务器广播消息
socket.on("sendMessage", (data) => {
  console.log("data", data);
  messageList.value.push({ ...data, from: "server" });
  scrollBottom();
});
// 发送消息内容
const message = ref("");
// 聊天记录列表
const messageList = ref([]);
// 发送消息
const send = () => {
  if (!message.value) return;
  const value = {
    createTiem: new Date(),
    text: message.value,
  };

  socket.emit("sendMessage", {
    from: "client",
    ...value,
  });
  messageList.value.push({
    from: "client",
    ...value,
  });
  message.value = "";
  scrollBottom();
};
// 聊天框外层盒子
const messageListRef = ref();
// 判断是否滚动到底部
const isEnd = ref(false);

// 监听滚动事件
const handleScroll = () => {
  if (
    messageListRef.value.scrollTop + messageListRef.value.offsetHeight <
    messageListRef.value.scrollHeight
  ) {
    isEnd.value = true;
  } else {
    isEnd.value = false;
  }
};

// 滚动底部
const scrollBottom = () => {
  if (!isEnd.value) {
    nextTick(() => {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    });
  }
};

// 初始化
const init = () => {
  messageList.value = JSON.parse(localStorage.getItem("messageList"));
  nextTick(() => {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  });
  messageListRef.value.addEventListener("scroll", () => {
    handleScroll();
  });
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  messageListRef.value?.removeEventListener("scroll", () => {
    handleScroll();
  });
});

// 聊天记录持久化
watchEffect(() => {
  if (messageList.value.length) {
    localStorage.setItem("messageList", JSON.stringify(messageList.value));
  }
});
</script>

<template>
  <div class="out-box">
    <div class="container">
      <h2 class="title">socket</h2>
      <div class="message-list" ref="messageListRef">
        <div
          :class="['message-item', item.from === 'client' ? 'client' : '']"
          v-for="(item, index) in messageList"
          :key="index"
          ref="messageRef"
        >
          <div class="message-text">
            <p
              class="username"
              :style="{ textAlign: item.from === 'client' ? 'right' : 'left' }"
            >
              {{ item.from === "client" ? "自己" : "对方" }}
            </p>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="message-box">
      <input type="text" v-model="message" @keyup.enter="send" />
      <button @click="send">发送</button>
    </div>
  </div>
</template>

<style scoped>
.out-box {
  width: 50vw;
  height: 50vh;
  background-color: #aaa;
  position: relative;
  padding: 16px 16px 67px 16px;
  border-radius: 4px;
}

.container {
  height: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  padding-bottom: 16px;
}

.message-list {
  background-color: #ccc;
  flex: 1;
  overflow: auto;
  border-radius: 4px;
}

.message-item {
  padding: 10px 14px;
  display: flex;
}

.client {
  justify-content: end;
}

.message-text {
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
}

.username {
  font-size: 12px;
  color: #aaa;
  padding-bottom: 4px;
}

.message-box {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 4px;
}
input {
  flex: 1;
  height: 35px;
  outline: none;
  border: 0;
  padding: 0 14px;
  border-radius: 4px;
}

button {
  padding: 4px 16px;
  margin-left: 12px;
  outline: none;
  border: 0;
  background-color: #18bfe9;
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
}
/* 整个滚动条 */
::-webkit-scrollbar {
  background-color: #aaa;
  width: 4px;
}
/* 滚动条上的按钮（上下箭头） */
::-webkit-scrollbar-button {
  height: 0;
}
/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #fff;
  border-radius: 8px;
}
/* 滚动条没有滑块的轨道部分 */
::-webkit-scrollbar-track-piece {
  background-color: #ccc;
}
</style>
