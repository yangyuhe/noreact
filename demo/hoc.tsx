import { MVVM, React } from "../src";

export class HOC extends MVVM {
    protected $Render() {
        return <div>
            <CommentListWithSubscription />
            <BlogPostWithSubscription id="1" />
        </div>
    }
}
class CommentList extends MVVM {
    constructor(private props: { data: any[] }) {
        super(props)
    }
    $Render() {
        return <ul>评论列表
            {this.props.data.map(item => (<li>{item}</li>))}
        </ul>
    }
}
class BlogPost extends MVVM {
    constructor(private props: { data: any }) {
        super(props)
    }
    $Render() {
        return <ul>博客
            <li>作者:{this.props.data.name}</li>
            <li>题目:{this.props.data.title}</li>
        </ul>
    }
}
const CommentListWithSubscription = withSubscription(
    CommentList,
    (dataSource) => dataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
    BlogPost,
    (dataSource, props) => dataSource.getBlogPost(props.id)
);

let DataSource = {
    listeners: [],
    comments: ["comment1", "comment2", "comment3", "comment4"],
    blogs: [{ id: 1, name: "图灵", title: "javascript进阶" }],
    addChangeListener: function (onchange: Function) {
        this.listeners.push(onchange);
    },
    removeChangeListener: function (onchange: Function) {
        this.listeners = this.listeners.filter(item => item != onchange);
    },
    getComments: function () {
        return this.comments;
    },
    getBlogPost: function (id) {
        return this.blogs.find(item => item.id == id);
    },
    startTimmer() {
        setInterval(() => {
            let random = Math.floor((Math.random() * this.comments.length));
            [this.comments[random], this.comments[0]] = [this.comments[0], this.comments[random]];
            this.blogs[0].title += "*";
            this.listeners.forEach(l => l());
        }, 1000);
    }
};
DataSource.startTimmer();
function withSubscription(WrappedComponent: typeof MVVM, selectData: (dataSource, props) => any) {
    // ...并返回另一个组件...
    return class extends MVVM {
        data: any = [];
        constructor(private props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.data = selectData(DataSource, props)
        }

        $didMounted() {
            // ...负责订阅相关的操作...
            DataSource.addChangeListener(this.handleChange);
        }

        $willUnMount() {
            DataSource.removeChangeListener(this.handleChange);
        }

        handleChange() {
            this.data = selectData(DataSource, this.props)
        }

        $Render() {
            // ... 并使用新数据渲染被包装的组件!
            // 请注意，我们可能还会传递其他属性
            return <WrappedComponent data={this.data} {...this.props} />;
        }
    };
}