<script setup>
import { ref, onMounted, onUnmounted, nextTick, watchEffect } from "vue";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log(socket);
});

socket.on("disconnect", () => {
  console.log(socket);
});

// socket.emit("message", { name: "李四", text: "早啊" });
// socket.on("message", (data) => {
//   console.log("data", data);
// });

socket.on("sendMessage", (data) => {
  console.log("data", data);
  messageList.value.push({ ...data, from: "server" });
  scrollBottom();
});

const message = ref("");
const messageList = ref([]);
const send = () => {
  if (!message.value) return;
  const value = {
    createTiem: new Date(),
    text: message.value,
  };

  socket.emit(
    "sendMessage",
    {
      from: "client",
      ...value,
    }
    // 服务端使用
    // socket.on("sendMessage", (data, callback) => {
    //   callback(data);
    // });
    // 客户端使用
    // (res) => {
    //   console.log("res", res);
    //   messageList.value.push(res);
    //   scrollBottom();
    // }
  );
  messageList.value.push({
    from: "client",
    ...value,
  });
  message.value = "";
  scrollBottom();
};

const messageListRef = ref();
const isEnd = ref(false);

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

const scrollBottom = () => {
  if (!isEnd.value) {
    nextTick(() => {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    });
  }
};

onMounted(() => {
  messageList.value = JSON.parse(localStorage.getItem("messageList"));
  nextTick(() => {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  });
  messageListRef.value.addEventListener("scroll", () => {
    handleScroll();
  });
});

onUnmounted(() => {
  messageListRef.value?.removeEventListener("scroll", () => {
    handleScroll();
  });
});

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

.server {
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
