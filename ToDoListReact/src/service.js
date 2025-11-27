import axios from 'axios';

// ----------------------
// הגדרות כלליות ל-axios
// ----------------------
// הקוד קורא את הכתובת ממשתנה סביבה שמוגדר ב-Render
const baseURL = process.env.REACT_APP_API_BASE_URL; 
axios.defaults.baseURL = baseURL;

// אופציונלי: אם יש טוקן, ניתן להוסיף כאן כותרת ברירת מחדל
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// interceptor לתפיסת שגיאות ב-response
axios.interceptors.response.use(
  response => response,
  error => {
    // רישום לוג מפורט לשגיאות (ניתן לשדרג לשליחת ל-server-side logging)
    console.error('API response error:', error);

    // אפשר להציג הודעות משתמש מרכזיות או לבצע טיפול כללי:
    // if (error.response && error.response.status === 401) { ... }

    return Promise.reject(error);
  }
);

// ----------------------
// ממשק פונקציות ל-API
// ----------------------

// חשוב: ה-API בשרת מנותב ל-:
// GET  /api/todos         -> כל המשימות
// GET  /api/todos/{id}    -> משימה לפי id
// POST /api/todos         -> יצירת משימה חדשה
// PUT  /api/todos/{id}    -> עדכון משימה
// DELETE /api/todos/{id}  -> מחיקת משימה

export default {
  // משיכה של כל המשימות
  getTasks: async () => {
    try {
      const resp = await axios.get('/api/todos');
      return resp.data;
    } catch (err) {
      console.error('getTasks failed', err);
      throw err;
    }
  },

  // הוספת משימה חדשה - מקבל שם (title) ואפשרות לתיאור
  addTask: async (name, description = '') => {
    try {
      const payload = {
        title: name,
        description: description,
        isCompleted: false
      };
      const resp = await axios.post('/api/todos', payload);
      return resp.data;
    } catch (err) {
      console.error('addTask failed', err);
      throw err;
    }
  },

  // עדכון סטטוס הושלמה - מקבל id והמצב החדש של isCompleted
  // הפעולה מבצעת קריאה ל-get כדי לקבל את המשימה המלאה ואז עושה PUT
  setCompleted: async (id, isComplete) => {
    try {
      // קבל את המשימה הנוכחית
      const getResp = await axios.get(`/api/todos/${id}`);
      const item = getResp.data;

      // עדכן את השדה
      item.isCompleted = isComplete;

      // בצע עדכון מלא (PUT)
      const putResp = await axios.put(`/api/todos/${id}`, item);
      return putResp.data;
    } catch (err) {
      console.error('setCompleted failed', err);
      throw err;
    }
  },

  // מחיקת משימה לפי id
  deleteTask: async (id) => {
    try {
      const resp = await axios.delete(`/api/todos/${id}`);
      return resp.data;
    } catch (err) {
      console.error('deleteTask failed', err);
      throw err;
    }
  }
};
