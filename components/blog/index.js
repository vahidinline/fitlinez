import { Text } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import CategoryList from '../../screens/Home/categoryList';

function BlogIndex() {
  const [post, setPost] = useState([]);

  const getPosts = async () => {
    try {
      const data = await axios.get('http://192.168.1.4:8080/blog');
      setPost(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View>
      <CategoryList data={post} view={true} />
    </View>
  );
}

export default BlogIndex;
