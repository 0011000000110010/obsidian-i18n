export interface User {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    remark?: string; // 企业备注名
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    member_role: string;
}

export interface Assignee {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    remark?: string; // 企业备注名
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    member_role: string;
}
export interface Author {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    remark?: string; // 企业备注名
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    member_role: string;
}
export interface RepositoryOwner {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    remark?: string; // 企业备注名
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    member_role: string;
}
export interface Namespace {
    id: number;
    type: 'Enterprise' | 'Group' | null;
    name: string;
    path: string;
    html_url: string;
}

export interface Repository {
    id: number;
    full_name: string;
    human_name: string;
    namespace: Namespace;
    path: string;
    name: string;
    owner: RepositoryOwner;
    description: string;
    private: boolean;
    public: boolean;
    internal: boolean;
    fork: boolean;
    html_url: string;
    ssh_url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    hooks_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    stargazers_url: string;
    contributors_url: string;
    commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    recommend: boolean;
    gvp: boolean;
    homepage: string;
    language: string;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    default_branch: string;
    open_issues_count: number;
    has_issues: boolean;
    has_wiki: boolean;
    issue_comment: boolean;
    can_comment: boolean;
    pull_requests_enabled: boolean;
    has_page: boolean;
    license: string;
    Outsourced: boolean;
    project_creator: string;
    members: string[];
    pushed_at: string;
    created_at: string;
    updated_at: string;
}

export interface IssueStateDetail {
    id: number;
    title: string;
    color: string;
    icon: string;
    command: string;
    serial: number;
    created_at: string;
    updated_at: string;
}

export interface IssueTypeDetail {
    id: number;
    title: string;
    template: string;
    ident: string;
    color: string;
    is_system: boolean;
    created_at: string;
    updated_at: string;
}

export interface Label {
    labels_url: string;
    milestone?: Milestone;
}

export interface Milestone {
    url: string;
    html_url: string;
    number: number;
    repository_id: number;
    state: string;
    title: string;
    description: string;
    updated_at: string;
    created_at: string;
    open_issues: number;
    closed_issues: number;
    due_on: string;
}

export interface Collaborator {
    comments: number;
    comments_url: string;
    created_at: string;
    deadline: string;
    depth: number;
    finished_at: string;
    html_url: string;
    id: number;
    issue_state_detail: IssueStateDetail;
    issue_type_detail: IssueTypeDetail;
    labels: Label[];
}

export interface Issue {
    assignee: Assignee;
    author: Author;
    body: string;
    body_html: string;
    branch: string;
    collaborators: Collaborator[];
    labels: Label[];
    milestone: Milestone;
    number: string;
    parent_id: number;
    parent_url: string;
    plan_started_at: string;
    priority: number;
    program: {
        id: number;
        name: string;
        description: string;
        assignee: Assignee;
        author: Author;
        repository: Repository;
    };
    repository: Repository;
    status: string;
    enterprise: Namespace;
    project_labels: Label[];
    issue_template_source: 'project' | 'enterprise';
    repository_url: string;
    scheduled_time: number;
    security_hole: boolean;
    state: string;
    title: string;
    updated_at: string;
    url: string;
    user: User;
}

export interface Contributor {
    login: string;
    name: string;
    url: string;
    translation: number;
    modification: number;
    erasure: number;
}


export interface GiteeContents {
    _links: {
        [key: string]: string;
    };
    content: string;
    download_url: string;
    encoding: string;
    html_url: string;
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    url: string;
}