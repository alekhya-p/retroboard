<template>
  <AppPage variant="narrow">
    <div class="create-board-header">
      <h1>Create New Retro Board</h1>
    </div>
    <form class="create-board-form surface" @submit.prevent="handleSubmit" novalidate>
      <div class="form-section">
        <label>Board Name</label>
        <input
          v-model="form.name"
          type="text"
          :class="{ invalid: errors.name }"
          placeholder="Enter board name"
          required
        />
        <div v-if="errors.name" class="error-msg">{{ errors.name }}</div>
      </div>
      <div class="form-section">
        <label>Description</label>
        <textarea
          v-model="form.description"
          :class="{ invalid: errors.description }"
          placeholder="Enter board description"
          required
        ></textarea>
        <div v-if="errors.description" class="error-msg">{{ errors.description }}</div>
      </div>
      <div class="form-section" v-if="showBlockId">
        <label>Block ID</label>
        <select v-model="form.block_id" :class="{ invalid: errors.block_id }" required>
          <option value="" disabled>Select a group</option>
          <option v-for="group in userGroups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
        <div v-if="errors.block_id" class="error-msg">{{ errors.block_id }}</div>
      </div>
      <div class="form-section">
        <label>Columns</label>
        <div v-for="(column, index) in form.columns" :key="index" class="column-row">
          <div class="column-row-top">
            <input
              v-model="column.name"
              type="text"
              placeholder="Column Name"
              :class="{ invalid: errors[`col_name_${index}`] }"
              required
            />
            <div class="column-row-controls">
              <input
                v-model="column.color"
                type="color"
                class="color-input"
                required
              />
              <label class="switch">
                <input type="checkbox" v-model="column.is_action_column" />
                <span class="slider"></span>
                <span class="switch-label">Action</span>
              </label>
              <button
                type="button"
                class="btn btn--danger btn--ghost btn--sm btn--icon"
                @click="removeColumn(index)"
                :disabled="form.columns.length === 1"
                title="Remove column"
              >✖</button>
            </div>
          </div>
          <textarea
            v-model="column.description"
            placeholder="Description"
            :class="{ invalid: errors[`col_desc_${index}`] }"
            rows="2"
            required
          ></textarea>
          <div v-if="errors[`col_desc_${index}`]" class="error-msg">{{ errors[`col_desc_${index}`] }}</div>
        </div>
        <button
          type="button"
          class="btn btn--outline add-col-btn"
          @click="addColumn"
          :disabled="form.columns.length >= 5"
        >＋ Add Column</button>
        <div v-if="errors.columns" class="error-msg">{{ errors.columns }}</div>
      </div>
      <div class="form-section">
        <label>
          <input type="checkbox" v-model="form.configurations.show_all_messages" />
          Show All Messages
        </label>
        <label>
          <input type="checkbox" v-model="form.configurations.enable_likes" />
          Enable Likes
        </label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--subtle" @click="router.push('/boards')">Cancel</button>
        <button type="submit" class="btn btn--primary" :disabled="loading">
          <span v-if="loading">Creating...</span>
          <span v-else>Create Board</span>
        </button>
      </div>
      <div v-if="formMsg" :class="formMsgType">{{ formMsg }}</div>
    </form>
  </AppPage>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import type { Column } from '@/types';
import templates from '@/templates.json';
import AppPage from '@/components/ui/AppPage.vue';

const router = useRouter();
const boardStore = useBoardStore();
const authStore = useAuthStore();

const defaultColumn = (): Column => ({
  name: '',
  color: '#2563eb',
  description: '',
  is_action_column: false
});

const form = ref({
  name: '',
  description: '',
  block_id: '',
  columns: [defaultColumn()],
  configurations: {
    show_all_messages: true,
    enable_likes: true
  }
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);
const formMsg = ref('');
const formMsgType = ref(''); // 'error-msg' or 'success-msg'

const showBlockId = computed(() => {
  return authStore.user?.user_type === 'microsoft' && authStore.user?.groups?.length > 1;
});
const userGroups = computed(() => {
  if (authStore.user?.user_type === 'microsoft') {
    return authStore.user.groups || [];
  }
  return [];
});
watch(() => authStore.user?.user_type, (newType) => {
  if (newType === 'google') {
    form.value.block_id = authStore.user?.id || '';
  }
  if (newType === 'email') {
    form.value.block_id = authStore.user?.id || '';
  }
  if (newType === 'microsoft') {
    if(authStore.user?.groups?.length){
      form.value.block_id = authStore.user.groups[0] || '';
    } else {
      form.value.block_id = authStore.user?.id
    }
  }
}, { immediate: true });

const addColumn = () => {
  if (form.value.columns.length >= 7) return;
  form.value.columns.push(defaultColumn());
};
const removeColumn = (index: number) => {
  if (form.value.columns.length === 1) return;
  form.value.columns.splice(index, 1);
};

const validateForm = () => {
  errors.value = {};
  let valid = true;
  if (!form.value.name.trim()) {
    errors.value.name = 'Board name is required';
    valid = false;
  }
  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required';
    valid = false;
  }
  if (showBlockId.value && !form.value.block_id) {
    errors.value.block_id = 'Please select a group';
    valid = false;
  }
  if (!form.value.columns.length) {
    errors.value.columns = 'At least one column is required';
    valid = false;
  }
  form.value.columns.forEach((col, idx) => {
    if (!col.name.trim()) {
      errors.value[`col_name_${idx}`] = 'Column name required';
      valid = false;
    }
    if (!col.description.trim()) {
      errors.value[`col_desc_${idx}`] = 'Column description required';
      valid = false;
    }
  });
  return valid;
};

const handleSubmit = async () => {
  formMsg.value = '';
  formMsgType.value = '';
  if (!authStore.user) {
    formMsg.value = 'User authentication required';
    formMsgType.value = 'error-msg';
    return;
  }
  if (!validateForm()) {
    formMsg.value = 'Please fix the errors above.';
    formMsgType.value = 'error-msg';
    return;
  }
  try {
    loading.value = true;
    const board = await boardStore.createBoard({
      ...form.value,
      facilitator_id: authStore.user.id,
      block_id: (authStore.user.user_type === 'google' || authStore.user.user_type === 'email') ? authStore.user.id : form.value.block_id
    });
    formMsg.value = 'Board created successfully!';
    formMsgType.value = 'success-msg';
    setTimeout(() => router.push(`/boards/${board.id}`), 1000);
  } catch (error) {
    formMsg.value = 'Failed to create board. Please try again.';
    formMsgType.value = 'error-msg';
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.create-board-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 24px;
}
.create-board-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}
.form-section label {
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 2px;
}
input, textarea, select {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.color-input,
.switch input[type="checkbox"],
.form-section label > input[type="checkbox"] {
  width: auto;
}
input:focus, textarea:focus, select:focus {
  border: 1.5px solid #2563eb;
}
input.invalid, textarea.invalid, select.invalid {
  border: 1.5px solid #e11d48;
}
.error-msg {
  color: #e11d48;
  font-size: 0.97rem;
  margin-top: 2px;
}
.success-msg {
  color: #059669;
  font-size: 1rem;
  margin-top: 8px;
  text-align: center;
}
.column-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  background: none;
}
.column-row-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.column-row-top > input[type="text"] {
  flex: 1;
  min-width: 120px;
}
.column-row-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.column-row textarea {
  min-width: 120px;
  max-width: 100%;
  min-height: 36px;
  max-height: 80px;
  resize: vertical;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  margin-top: 2px;
}
.column-row textarea:focus {
  border: 1.5px solid #2563eb;
}
.color-input {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  padding: 0;
}
.switch {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}
.switch-label {
  font-size: 0.95em;
  color: #444;
}
.switch input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
.add-col-btn {
  margin-top: 6px;
  align-self: flex-start;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
@media (max-width: 700px) {
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
  .form-actions .btn {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .column-row-top {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  .column-row-controls {
    flex-direction: row;
    gap: 6px;
    margin-top: 4px;
  }
  .color-input {
    width: 32px;
    height: 32px;
  }
}
</style>
