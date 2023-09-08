<script setup>
import { ref, onMounted, nextTick } from "vue";
const message = ref("");
const messageList = ref([
  // { from: "server", createTime: "2016-04-12 13:53:32", text: "12" },
]);
const websocket = new WebSocket("ws://localhost:8080");

const send = () => {
  if (!message.value) return;
  const value = {
    createTiem: new Date(),
    text: message.value,
  };
  websocket.send(JSON.stringify(value));
  messageList.value.push({
    from: "client",
    ...value,
  });
  message.value = "";
  scrollBottom();
};
const getMessage = async (event) => {
  console.log(event);
  if (event.data instanceof Blob) {
    const text = await event.data.text();
    const message = JSON.parse(text);
    messageList.value.push(message);
    scrollBottom();
  }
};
websocket.onmessage = getMessage;
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
  messageListRef.value.addEventListener("scroll", () => {
    handleScroll();
  });
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
