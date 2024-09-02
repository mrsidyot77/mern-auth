import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    currentUser: null,
    loading: false,
    error : null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true
            state.error = null;
        },
        signInSuccess: (state,action)=>{
            state.currentUser = action.payload
            state.error = null
            state.loading = false
        },
        signInFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        updateAvatarStart:(state,action)=>{
            state.loading = true,
            state.error = null
        },
        updateAvatarSuccess: (state,action)=>{
            state.loading = false
            if(state.currentUser && state.currentUser.data && state.currentUser.data.user){
                state.currentUser.data.user.avatar = action.payload.avatar
            }
        },
        updateAvatarFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
            
        },
        updatePasswordStart: (state,action)=>{
            state.loading = true,
            state.error = null
        },
        updatePasswordSuccess:   (state,action)=>{
            state.loading = false
            state.error = null
        },
        updatePasswordFailure: (state,action)=>{
            state.loading = false
            state.error = action.payload
            
        },
    }
})

export const {signInStart, signInSuccess, signInFailure, updateAvatarSuccess, updateAvatarFailure, updateAvatarStart, updatePasswordStart,updatePasswordSuccess,updatePasswordFailure} = userSlice.actions

export default userSlice.reducer