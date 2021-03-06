

template <class T>
void Meuclid<T>::checkRec(
    const Rec & av0, const Rec & av,
    const Rec & avb, T aet, T aft)
{
    T x = add( mul(av0.a, av.e) , mul(av0.b, av.f) );
    T y = add( mul(avb.a, aet) , mul(avb.b, aft) );

    if ( x != y )
        throw "Error: [pej+qfj!=aet+bft] " + x.str() + ":" + y.str();
}


template <class T>
void Meuclid<T>::fillAB(T x, T y)
{
    if (x < y) x.swap(y);
    v.clear();
    Rec r;
    r.a = x;
    r.b = y;
    v.push_back(r);

    int i = 0;
    if ( v[i].b != 0 )
        while ( 1 )
        {
            //v[i].c = v[i].a%v[i].b;
            //v[i].d = v[i].a/v[i].b;
            T::divABRQ(v[i].a, v[i].b, &v[i].c, &v[i].d);
            if ( v[i].c == 0 ) break;
            v.push_back(Rec()); i++;

            v[i].a = v[i - 1].b;
            v[i].b = v[i - 1].c;
        }
}

template <class T>
void Meuclid<T>::fillEF()
{
    int n = gl::st2i(v.size()) - 1;

    for ( int i = n; i >= 0; i-- )
    {
        v[i].e = et;
        v[i].f = ft;
        for ( int j = i - 1; j >= 0; j-- )
        {
            v[j].e = v[j + 1].f;
            v[j].f = sub( v[j + 1].e, mul( v[j].d, v[j].e ) );
        }

        v[i].e = v[0].e;
        v[i].f = v[0].f;
    }
}

template <class T>
string Meuclid<T>::str() const
{
    string r;
    for ( int i = 0; i < (int)v.size(); i++ )
    {
        r += v[i].a.str() + ' ' + v[i].b.str() + ' ' + v[i].c.str()
             + ' ' + v[i].d.str() + ' ' + v[i].e.str() + ' '
             + v[i].f.str() + ' ' + v[i].g.str() + '\n';
    }
    return r;
}

template <class T>
void Meuclid<T>::fillG()
{
    int n = gl::st2i(v.size()) - 1;

    for ( int i = n; i >= 0; i-- )
    {
        checkRec(v[0], v[i], v[i], et, ft);

        v[i].g = add( add( mul(v[i].a, et), mul(v[i].b, ft) ), mul(v[i].e, v[i].f) );

        if (0)if ( v[i].g < 0 )
            {
                T y = add( v[i].e, v[0].b );
                if ( y > 0 )
                {
                    //T x = (-v[i].g)/y + 1;
                    T x = add( divq( (neg(v[i].g)), y) , 1 );
                    //v[i].f += x;
                    v[i].f.addMod(x, mod);
                    v[i].g = add( add( mul(v[0].a, v[i].e),
                                       mul(v[0].b, v[i].f) ), mul(v[i].e, v[i].f) );
                }
            }

        if ( v[i].g > 0 )
        {
            if ( gsmall == 0  || gsmall > v[i].g ) gsmall = v[i].g;
        }
    }
}


