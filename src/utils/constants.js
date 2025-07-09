//just used for proper aarrangements of token
export const UserRolesEnum = {
    ADMIN:"admin",
    PROJECT_ADMIN :"project admin",
    MEMBER: "member",
};

export const AvaliableUserRoles=Object.values(UserRolesEnum);
//object values returns an array


export const TaskStatusEnum ={
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done",
};

export const AvaliableTaskstatustes=Object.values(TaskStatusEnum)