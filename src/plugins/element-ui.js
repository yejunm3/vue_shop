import Vue from "vue";
import 'element-ui/lib/theme-chalk/index.css';

import { 
    Button,
    Input,
    Form,
    FormItem,
    Message
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
// 全局挂载 $message
Vue.prototype.$message = Message;

