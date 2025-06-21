export type UserType = {
    country: string;
    creationDate: string;
    email: string;
    id: number;
    imagePath: string;
    isActivated: boolean;
    modificationDate: string;
    phoneNumber: string;
    userName: string;
};

export type ProjectType = {
    id: number;
    title: string;
    description: string;
    creationDate: string;
    modificationDate: string;
};

export type TaskType = {
    creationDate: string;
    description: string;
    employee: UserType;
    id: number;
    modificationDate: string;
    project: ProjectType;
    status: "ToDo" | "InProgress" | "Done";
    title: string;
};

export type ProjectSelectProps = {
    register: any;
    errors: any;
    task?: TaskType;
    projectsList: ProjectType[];
    projectsHasMore: boolean;
    fetchMoreProjects: () => void;
};

export type UsersSelectProps = {
    register: any;
    errors: any;
    task?: TaskType;
    usersList: UserType[];
    usersHasMore: boolean;
    fetchMoreUsers: () => void;
};

export type TaskFormInputs = {
    title: string;
    description: string;
    employeeId: string;
    projectId: string;
};
